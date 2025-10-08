import { LayoutList, Calendar, BarChart3, Kanban, Table2, GitBranch, CalendarDays } from "lucide-react";
import styled from "styled-components";

export type ViewType = "list" | "timeline" | "kanban" | "analytics" | "datagrid" | "gantt" | "scheduler";

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const StyledWrapper = styled.div`
  .radio-container {
    --main-color: #8b5cf6;
    --main-color-opacity: #8b5cf61c;
    --total-radio: 7;

    display: flex;
    flex-direction: row;
    position: relative;
    padding-bottom: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .radio-container::-webkit-scrollbar {
    display: none;
  }
  
  .radio-container input {
    cursor: pointer;
    appearance: none;
    position: absolute;
    opacity: 0;
  }
  
  .radio-container .glider-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(27, 27, 27, 1) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    height: 2px;
  }
  
  .radio-container .glider-container .glider {
    position: relative;
    width: calc(100% / var(--total-radio));
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      var(--main-color) 50%,
      rgba(0, 0, 0, 0) 100%
    );
    transition: transform 0.5s cubic-bezier(0.37, 1.95, 0.66, 0.56);
  }
  
  .radio-container .glider-container .glider::before {
    content: "";
    position: absolute;
    width: 60%;
    height: 300%;
    left: 50%;
    transform: translateX(-50%);
    background: var(--main-color);
    filter: blur(10px);
  }
  
  .radio-container .glider-container .glider::after {
    content: "";
    position: absolute;
    top: 0;
    width: 100%;
    height: 150px;
    background: linear-gradient(
      180deg,
      var(--main-color-opacity) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }
  
  .radio-container label {
    cursor: pointer;
    padding: 0.75rem 1rem;
    position: relative;
    color: #9ca3af;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .radio-container input:checked + label {
    color: var(--main-color);
  }

  .radio-container input:nth-of-type(1):checked ~ .glider-container .glider {
    transform: translateX(0);
  }

  .radio-container input:nth-of-type(2):checked ~ .glider-container .glider {
    transform: translateX(100%);
  }

  .radio-container input:nth-of-type(3):checked ~ .glider-container .glider {
    transform: translateX(200%);
  }

  .radio-container input:nth-of-type(4):checked ~ .glider-container .glider {
    transform: translateX(300%);
  }

  .radio-container input:nth-of-type(5):checked ~ .glider-container .glider {
    transform: translateX(400%);
  }

  .radio-container input:nth-of-type(6):checked ~ .glider-container .glider {
    transform: translateX(500%);
  }

  .radio-container input:nth-of-type(7):checked ~ .glider-container .glider {
    transform: translateX(600%);
  }

  .radio-container label svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  const views = [
    { type: "list" as ViewType, icon: LayoutList, label: "List" },
    { type: "timeline" as ViewType, icon: Calendar, label: "Timeline" },
    { type: "kanban" as ViewType, icon: Kanban, label: "Board" },
    { type: "analytics" as ViewType, icon: BarChart3, label: "Analytics" },
    { type: "datagrid" as ViewType, icon: Table2, label: "DataGrid" },
    { type: "gantt" as ViewType, icon: GitBranch, label: "Gantt" },
    { type: "scheduler" as ViewType, icon: CalendarDays, label: "Scheduler" },
  ];

  return (
    <StyledWrapper>
      <div className="radio-container">
        {views.map((view, index) => (
          <>
            <input
              key={`input-${view.type}`}
              id={`radio-${view.type}`}
              name="view-radio"
              type="radio"
              checked={currentView === view.type}
              onChange={() => onViewChange(view.type)}
            />
            <label key={`label-${view.type}`} htmlFor={`radio-${view.type}`}>
              <view.icon />
              {view.label}
            </label>
          </>
        ))}
        <div className="glider-container">
          <div className="glider" />
        </div>
      </div>
    </StyledWrapper>
  );
};
