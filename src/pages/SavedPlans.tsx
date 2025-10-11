import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  CheckCircle2,
  Star,
  Archive,
  MoreVertical,
  Search,
  Plus,
  Trash2,
  Copy,
  Calendar,
  TrendingUp,
  FolderOpen,
} from "lucide-react";
import { plansAPI, Plan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const SavedPlans = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'archived'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Use actual user ID from auth
  const userId = user?._id || "";

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      const response = await plansAPI.getPlans({ userId, sortBy: 'updatedAt', order: 'desc' });
      setPlans(response.data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filterPlans = () => {
    let filtered = plans;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(plan => plan.status === filterStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.projectName.toLowerCase().includes(query) ||
        plan.projectSummary.toLowerCase().includes(query) ||
        plan.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPlans(filtered);
  };

  useEffect(() => {
    filterPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans, searchQuery, filterStatus]);

  const handleLoadPlan = (plan: Plan) => {
    // Navigate to main app with plan data
    navigate('/app', { state: { plan } });
  };

  const handleToggleStar = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await plansAPI.toggleStar(planId);
      setPlans(plans.map(p => p._id === planId ? { ...p, isStarred: !p.isStarred } : p));
      toast({
        title: "Success",
        description: "Plan starred status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await plansAPI.duplicatePlan(planId);
      setPlans([response.data, ...plans]);
      toast({
        title: "Success",
        description: "Plan duplicated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate plan",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this plan?")) return;
    
    try {
      await plansAPI.deletePlan(planId);
      setPlans(plans.filter(p => p._id !== planId));
      toast({
        title: "Success",
        description: "Plan deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete plan",
        variant: "destructive",
      });
    }
  };

  const handleArchive = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await plansAPI.toggleArchive(planId);
      setPlans(plans.map(p => p._id === planId ? { ...p, status: response.data.status } : p));
      toast({
        title: "Success",
        description: `Plan ${response.data.status === 'archived' ? 'archived' : 'restored'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'archived':
        return <Archive className="h-4 w-4 text-slate-400" />;
      default:
        return <Clock className="h-4 w-4 text-cyan-500" />;
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                My Plans
              </h1>
              <p className="text-slate-400 mt-1">
                {plans.length} {plans.length === 1 ? 'plan' : 'plans'} total
              </p>
            </div>
            <Button
              onClick={() => navigate('/app')}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 text-slate-950"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search plans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700/50 focus:border-cyan-500"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'completed', 'archived'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status 
                    ? "bg-cyan-500 text-white" 
                    : "border-slate-700 text-slate-300 hover:border-cyan-500/50"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-900/50 border-slate-700/50 animate-pulse">
                <CardHeader className="space-y-3">
                  <div className="h-6 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-slate-800 rounded"></div>
                  <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPlans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <FolderOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No plans found</h3>
            <p className="text-slate-400 mb-6">
              {searchQuery ? 'Try adjusting your search' : 'Create your first plan to get started'}
            </p>
            <Button
              onClick={() => navigate('/app')}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Plan
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="bg-slate-900/80 border-slate-700/50 hover:border-cyan-500/50 transition-all cursor-pointer group hover:shadow-lg hover:shadow-cyan-500/10"
                  onClick={() => handleLoadPlan(plan)}
                  style={{ borderLeftColor: plan.color, borderLeftWidth: '4px' }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {plan.projectName}
                        </CardTitle>
                        <CardDescription className="mt-2 line-clamp-2 text-slate-400">
                          {plan.projectSummary}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleToggleStar(plan._id!, e)}
                          className="p-1 rounded hover:bg-slate-800 transition-colors"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              plan.isStarred
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-slate-400 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                            <DropdownMenuItem onClick={(e) => handleDuplicate(plan._id!, e)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => handleArchive(plan._id!, e)}>
                              <Archive className="mr-2 h-4 w-4" />
                              {plan.status === 'archived' ? 'Restore' : 'Archive'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => handleDelete(plan._id!, e)}
                              className="text-red-400"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-cyan-400 font-medium">{plan.progressPercentage}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all"
                          style={{ width: `${plan.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-slate-400">
                          {plan.completedTasks}/{plan.totalTasks} tasks
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-cyan-500" />
                        <span className="text-sm text-slate-400">
                          {plan.estimatedDuration}h
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {plan.tags && plan.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {plan.tags.slice(0, 3).map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs border-slate-700 text-slate-400">
                            {tag}
                          </Badge>
                        ))}
                        {plan.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs border-slate-700 text-slate-400">
                            +{plan.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {getStatusIcon(plan.status)}
                        <span className="capitalize">{plan.status}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {formatDate(plan.updatedAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedPlans;
