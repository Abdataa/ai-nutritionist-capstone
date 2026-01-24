import { useState, useEffect } from 'react';
import { Utensils, Calendar, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ThemeToggle } from '../components/ThemeToggle';
import authService from '../services/auth.service';

export function UserDashboard({ onNavigate, currentUser }) {
  const [userPlans, setUserPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPlans: 0,
    activePlans: 0,
    completedPlans: 0,
    avgCalories: 0
  });

  // Fetch user's meal plans
  useEffect(() => {
    const fetchUserPlans = async () => {
      try {
        setLoading(true);
        const plans = await authService.getUserMealPlans();
        setUserPlans(plans);
        
        // Calculate stats
        const totalPlans = plans.length;
        const activePlans = plans.filter(plan => plan.status === 'Active').length;
        const completedPlans = plans.filter(plan => plan.status === 'Completed').length;
        const avgCalories = plans.length > 0 
          ? Math.round(plans.reduce((sum, plan) => sum + plan.daily_calories, 0) / plans.length)
          : 0;
          
        setStats({
          totalPlans,
          activePlans,
          completedPlans,
          avgCalories
        });
      } catch (error) {
        console.error('Error fetching user plans:', error);
        // Fallback to mock data
        setUserPlans([
          {
            id: 1,
            title: "Initial Weight Loss Plan",
            goal: "Fat Loss",
            daily_calories: 1800,
            diet_type: "Keto",
            created_at: "2025-01-15T10:30:00Z",
            status: "Active"
          },
          {
            id: 2,
            title: "Maintenance Phase",
            goal: "Maintenance",
            daily_calories: 2200,
            diet_type: "Balanced",
            created_at: "2025-01-10T14:20:00Z",
            status: "Completed"
          }
        ]);
        
        setStats({
          totalPlans: 2,
          activePlans: 1,
          completedPlans: 1,
          avgCalories: 2000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlans();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {getUserGreeting()}{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Welcome to your nutrition dashboard. Track your progress and meal plans.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Total Plans
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center transition-transform hover:scale-110">
              <Utensils className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.totalPlans}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Meal plans created</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Active Plans
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center transition-transform hover:scale-110">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.activePlans}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Currently following</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Avg. Calories
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center transition-transform hover:scale-110">
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.avgCalories}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Per day</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Completed
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center transition-transform hover:scale-110">
              <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {stats.completedPlans}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Plans finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6 sm:mb-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Your Actions</CardTitle>
          <CardDescription>Manage your nutrition journey</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onNavigate('history')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Plan History
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('settings')}
            className="w-full sm:w-auto hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
          >
            <Target className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* My Meal Plans */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">My Meal Plans</CardTitle>
          <CardDescription>Your personalized nutrition plans</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-4 text-slate-600 dark:text-slate-300">Loading your plans...</p>
            </div>
          ) : userPlans.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No meal plans yet</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Contact your nutrition coach to create your first personalized meal plan.
              </p>
              <Button 
                onClick={() => onNavigate('history')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View History
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-700"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white">{plan.title || `Plan #${plan.id}`}</h4>
                      <Badge 
                        className={`${
                          plan.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                            : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {plan.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {plan.goal} • <span className="font-medium">{plan.daily_calories} cal/day</span> • {plan.diet_type}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(plan.created_at)}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onNavigate('demo')}
                      className="hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400"
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}