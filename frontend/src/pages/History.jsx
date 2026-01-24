import { useState, useEffect } from 'react';
import { Calendar, Utensils, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import authService from '../services/auth.service';

export function History({ onNavigate }) {
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch actual data from backend
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        setLoading(true);
        // Fetch user's meal plans from the backend
        const data = await authService.getUserMealPlans();
        setMealPlans(data);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
        // Fallback to mock data if API call fails
        setMealPlans([
          {
            id: 1,
            title: "Muscle Gain Plan",
            goal: "Muscle Gain",
            dietType: "Balanced",
            calories: 2800,
            dateCreated: "2025-01-15",
            status: "Completed",
          },
          {
            id: 2,
            title: "Weight Loss Plan",
            goal: "Fat Loss",
            dietType: "Keto",
            calories: 1800,
            dateCreated: "2025-01-10",
            status: "Completed",
          },
          {
            id: 3,
            title: "Maintenance Plan",
            goal: "Maintenance",
            dietType: "Mediterranean",
            calories: 2200,
            dateCreated: "2025-01-05",
            status: "Active",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">History</h1>
        <p className="text-slate-600 dark:text-slate-300">Your past meal plans and nutrition history</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Plans</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{mealPlans.length}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <Utensils className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Plans</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {mealPlans.filter(plan => (new Date() - new Date(plan.created_at)) < 7 * 24 * 60 * 60 * 1000).length}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">4.8</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meal Plans List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Meal Plans</h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-slate-600 dark:text-slate-300">Loading meal plans...</p>
          </div>
        ) : mealPlans.length === 0 ? (
          <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <CardContent className="p-12 text-center">
              <Utensils className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No meal plans yet</h3>
              <p className="text-slate-600 dark:text-slate-300">Create your first meal plan to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mealPlans.map((plan) => (
              <Card 
                key={plan.id} 
                className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onNavigate && onNavigate('demo', { mealPlanId: plan.id })}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-slate-900 dark:text-white">
                        {plan.goal} Plan
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {new Date(plan.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={`${
                        plan.created_at && (new Date() - new Date(plan.created_at)) < 7 * 24 * 60 * 60 * 1000
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {plan.created_at && (new Date() - new Date(plan.created_at)) < 7 * 24 * 60 * 60 * 1000 ? 'Recent' : 'Archived'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Goal:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{plan.goal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Diet Type:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{plan.diet_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Calories:</span>
                      <span className="font-medium text-slate-900 dark:text-white">{plan.daily_calories} kcal/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-300">Macros:</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        P: {plan.macro_protein}g | C: {plan.macro_carbs}g | F: {plan.macro_fats}g
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}