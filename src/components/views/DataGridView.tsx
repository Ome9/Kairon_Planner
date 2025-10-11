import { useRef, useCallback, forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { Task } from "@/types/plan";
import DataGrid, {
  Column,
  Selection,
  Sorting,
  HeaderFilter,
  Paging,
  Pager,
  Editing,
  Scrolling,
  SearchPanel,
  Export,
  ColumnChooser,
  FilterRow,
  DataGridRef,
  RowDragging,
} from "devextreme-react/data-grid";
import type { InitNewRowEvent, RowInsertedEvent, RowUpdatedEvent, RowDraggingReorderEvent } from "devextreme/ui/data_grid";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver-es";
import { exportDataGrid as exportToPdf } from "devextreme/pdf_exporter";
import { exportDataGrid as exportToExcel } from "devextreme/excel_exporter";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

interface DataGridViewProps {
  tasks: Task[];
  onTaskAdd?: (task: Partial<Task>) => void;
  onTaskUpdate?: (taskId: number, updates: Partial<Task>) => void;
}

export interface DataGridViewHandle {
  exportToPDF: () => void;
  exportToExcel: () => void;
  showColumnChooser: () => void;
}

export const DataGridView = forwardRef<DataGridViewHandle, DataGridViewProps>(
  ({ tasks, onTaskAdd, onTaskUpdate }, ref) => {
    const gridRef = useRef<DataGridRef>(null);
    const [taskData, setTaskData] = useState<Task[]>(tasks);

    // Update taskData when tasks prop changes
    useEffect(() => {
      setTaskData(tasks);
    }, [tasks]);

    // Generate next available ID
    const getNextId = useCallback(() => {
      if (taskData.length === 0) return 1;
      const maxId = Math.max(...taskData.map(t => t.id));
      return maxId + 1;
    }, [taskData]);

    const exportToPDF = useCallback(() => {
      const doc = new jsPDF();
      const grid = gridRef.current?.instance();
      
      if (grid) {
        exportToPdf({
          jsPDFDocument: doc,
          component: grid,
        }).then(() => {
          doc.save("Tasks.pdf");
        });
      }
    }, []);

    const exportToExcelFile = useCallback(() => {
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Tasks");
      const grid = gridRef.current?.instance();

      if (grid) {
        exportToExcel({
          component: grid,
          worksheet,
          autoFilterEnabled: true,
        }).then(() => {
          workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              "Tasks.xlsx"
            );
          });
        });
      }
    }, []);

    const showColumnChooser = useCallback(() => {
      gridRef.current?.instance().showColumnChooser();
    }, []);

    // Handle row insertion with auto-ID
    const onInitNewRow = useCallback((e: InitNewRowEvent<Task, number>) => {
      e.data.id = getNextId();
      e.data.completed = false;
      e.data.dependencies = [];
      e.data.estimated_duration_hours = 1;
    }, [getNextId]);

    const onRowInserted = useCallback((e: RowInsertedEvent<Task, number>) => {
      const newTask = e.data;
      console.log("New task added:", newTask);
      // Don't add to taskData here - DataGrid already handles it
      // Just notify parent component
      onTaskAdd?.(newTask);
    }, [onTaskAdd]);

    // Handle row updates
    const onRowUpdated = useCallback((e: RowUpdatedEvent<Task, number>) => {
      const updatedTask = e.data;
      console.log("Task updated:", updatedTask);
      // Notify parent component of the update
      if (onTaskUpdate && updatedTask.id) {
        onTaskUpdate(updatedTask.id, updatedTask);
      }
    }, [onTaskUpdate]);

    // Handle drag-and-drop reordering
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onRowReorder = useCallback((e: any) => {
      const visibleRows = e.component.getVisibleRows();
      const fromIndex = taskData.findIndex((task: Task) => task.id === e.itemData.id);
      const toIndex = visibleRows[e.toIndex].dataIndex;
      
      const updatedTasks = [...taskData];
      const [movedTask] = updatedTasks.splice(fromIndex, 1);
      updatedTasks.splice(toIndex, 0, movedTask);
      
      setTaskData(updatedTasks);
    }, [taskData]);

    useImperativeHandle(ref, () => ({
      exportToPDF,
      exportToExcel: exportToExcelFile,
      showColumnChooser,
    }));

    const getCategoryColor = (category: string) => {
      const colors: Record<string, string> = {
        Research: "#3b82f6",
        Design: "#a855f7",
        Development: "#22c55e",
        Marketing: "#f97316",
        Legal: "#ef4444",
        Planning: "#06b6d4",
        Testing: "#eab308",
        Financial: "#10b981",
        "Content Development": "#6366f1",
        Logistics: "#ec4899",
      };
      return colors[category] || "#6b7280";
    };

    const categoryCellRender = (data: { value: string }) => {
      const color = getCategoryColor(data.value);
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span>{data.value}</span>
        </div>
      );
    };

    const dependencyCellRender = (data: { value: number[] }) => {
      const deps = data.value || [];
      if (deps.length === 0) return <span className="text-muted-foreground">None</span>;
      return (
        <div className="flex flex-wrap gap-1">
          {deps.map((dep: number, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-500"
            >
              #{dep}
            </span>
          ))}
        </div>
      );
    };

    return (
      <div className="h-[600px] w-full">
        <style>{`
          /* DevExtreme DataGrid Custom Theme - High Contrast */
          .dx-datagrid {
            background: hsl(240 10% 7%);
            color: hsl(0 0% 98%);
          }
          .dx-datagrid-headers {
            background: hsl(263 70% 35%);
            color: white !important;
            font-weight: 600;
            border-bottom: 2px solid hsl(263 70% 50%);
          }
          .dx-datagrid-headers .dx-datagrid-text-content {
            color: white !important;
          }
          .dx-header-row .dx-datagrid-action {
            color: white !important;
          }
          .dx-datagrid-rowsview .dx-row {
            border-bottom: 1px solid hsl(240 3.7% 15.9%);
            color: hsl(0 0% 98%);
          }
          .dx-datagrid-rowsview .dx-row:hover {
            background: hsl(240 10% 12%) !important;
          }
          .dx-datagrid-rowsview .dx-row-focused {
            background: hsl(263 70% 20% / 0.3) !important;
          }
          .dx-datagrid .dx-row-alt {
            background: hsl(240 10% 5%);
          }
          .dx-datagrid .dx-editor-cell {
            color: hsl(0 0% 98%) !important;
          }
          .dx-texteditor-input {
            color: hsl(0 0% 98%) !important;
            background: hsl(240 10% 10%) !important;
          }
          .dx-pager {
            background: hsl(240 10% 7%);
            border-top: 1px solid hsl(240 3.7% 15.9%);
            color: hsl(0 0% 98%);
            padding: 12px;
          }
          .dx-page-sizes {
            color: hsl(0 0% 98%);
          }
          .dx-page-size {
            color: hsl(0 0% 98%) !important;
            background: hsl(240 10% 15%);
            border: 1px solid hsl(240 3.7% 25%);
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .dx-page-size:hover {
            background: hsl(263 70% 25%);
            border-color: hsl(263 70% 40%);
            color: white !important;
          }
          .dx-page-size.dx-selection {
            background: hsl(263 70% 45%);
            color: white !important;
            border-color: hsl(263 70% 50%);
          }
          .dx-pages .dx-page {
            color: hsl(0 0% 98%) !important;
            background: hsl(240 10% 15%);
            border: 1px solid hsl(240 3.7% 25%);
            margin: 0 2px;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
          }
          .dx-pages .dx-page:hover {
            background: hsl(263 70% 25%);
            border-color: hsl(263 70% 40%);
            color: white !important;
          }
          .dx-pages .dx-selection {
            background: hsl(263 70% 45%);
            color: white !important;
            border-color: hsl(263 70% 50%);
          }
          .dx-datagrid-search-text {
            background: hsl(240 10% 10%);
            color: hsl(0 0% 98%) !important;
            border: 1px solid hsl(240 3.7% 15.9%);
          }
          .dx-toolbar {
            background: hsl(240 10% 7%);
            border-bottom: 1px solid hsl(240 3.7% 15.9%);
            padding: 8px;
          }
          .dx-toolbar .dx-toolbar-label,
          .dx-toolbar .dx-toolbar-text-auto-hide {
            color: hsl(0 0% 98%) !important;
          }
          .dx-button {
            background: hsl(240 10% 15%);
            color: hsl(0 0% 98%) !important;
            border: 1px solid hsl(240 3.7% 25%);
          }
          .dx-button:hover {
            background: hsl(263 70% 25%);
            border-color: hsl(263 70% 40%);
            color: white !important;
          }
          .dx-button-text {
            color: hsl(0 0% 98%) !important;
          }
          .dx-icon {
            color: hsl(0 0% 98%) !important;
          }
          .dx-datagrid-filter-row .dx-editor-cell .dx-texteditor {
            background: hsl(240 10% 10%);
          }
          .dx-checkbox-icon {
            background: hsl(240 10% 15%);
            border-color: hsl(240 3.7% 25%);
          }
          .dx-checkbox-checked .dx-checkbox-icon {
            background: hsl(263 70% 45%);
            border-color: hsl(263 70% 50%);
          }
          /* Drag and Drop Styling */
          .dx-datagrid-drag-icon {
            color: hsl(0 0% 98%) !important;
            cursor: grab;
          }
          .dx-datagrid-drag-icon:active {
            cursor: grabbing;
          }
          .dx-row-dragging {
            background: hsl(263 70% 30% / 0.3) !important;
            border: 2px dashed hsl(263 70% 50%);
          }
          .dx-command-drag {
            width: 40px !important;
          }
          .dx-datagrid-drop-target-line {
            background: hsl(263 70% 50%);
            height: 3px;
          }
        `}</style>
        <DataGrid
          ref={gridRef}
          dataSource={taskData}
          keyExpr="id"
          columnAutoWidth
          showBorders
          hoverStateEnabled
          height="100%"
          wordWrapEnabled
          allowColumnReordering
          allowColumnResizing
          columnResizingMode="widget"
          onInitNewRow={onInitNewRow}
          onRowInserted={onRowInserted}
          onRowUpdated={onRowUpdated}
        >
          <RowDragging
            allowReordering
            onReorder={onRowReorder}
            showDragIcons
          />
          <SearchPanel visible placeholder="Search tasks..." />
          <HeaderFilter visible />
          <FilterRow visible />
          <ColumnChooser enabled mode="select" />
          <Sorting mode="multiple" />
          <Selection mode="multiple" showCheckBoxesMode="always" />
          <Scrolling mode="standard" />
          <Paging defaultPageSize={20} />
          <Pager
            visible
            showPageSizeSelector
            allowedPageSizes={[10, 20, 50, 100]}
            showInfo
            showNavigationButtons
          />
          <Editing mode="row" allowUpdating allowDeleting allowAdding />
          <Export enabled />

          <Column
            dataField="id"
            caption="ID"
            width={70}
            allowEditing={false}
            cssClass="font-bold text-purple-500"
          />
          <Column
            dataField="title"
            caption="Task Title"
            minWidth={200}
          />
          <Column
            dataField="category"
            caption="Category"
            width={150}
            cellRender={categoryCellRender}
          />
          <Column
            dataField="description"
            caption="Description"
            minWidth={250}
            visible={false}
          />
          <Column
            dataField="estimated_duration_hours"
            caption="Duration (hrs)"
            width={120}
            dataType="number"
          />
          <Column
            dataField="dependencies"
            caption="Dependencies"
            width={150}
            cellRender={dependencyCellRender}
            allowEditing={false}
          />
          <Column
            dataField="start_date"
            caption="Start Date"
            dataType="date"
            width={120}
            visible={false}
          />
          <Column
            dataField="end_date"
            caption="End Date"
            dataType="date"
            width={120}
            visible={false}
          />
        </DataGrid>
      </div>
    );
  }
);

DataGridView.displayName = "DataGridView";
