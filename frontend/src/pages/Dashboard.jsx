import { Users, TrendingUp, FileText, Calendar, Target, Utensils } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ThemeToggle } from '../components/ThemeToggle';

export function Dashboard({ onNavigate, currentUser }) {
  const stats = [
    {
      title: 'Active Clients',
      value: '24',
      change: '+3 this week',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Plans Generated',
      value: '156',
      change: '+12 this month',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
    {
      title: 'Avg. Calories/Day',
      value: '2,245',
      change: 'Across all plans',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Success Rate',
      value: '94%',
      change: 'Client goal achievement',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ];

  const recentPlans = [
    {
      client: 'Sarah Johnson',
      goal: 'Muscle Gain',
      calories: 2800,
      date: '2 days ago',
      status: 'Active',
    },
    {
      client: 'Mike Chen',
      goal: 'Fat Loss',
      calories: 1800,
      date: '5 days ago',
      status: 'Active',
    },
    {
      client: 'Emma Davis',
      goal: 'Maintenance',
      calories: 2200,
      date: '1 week ago',
      status: 'Completed',
    },
    {
      client: 'James Wilson',
      goal: 'Muscle Gain',
      calories: 3000,
      date: '1 week ago',
      status: 'Active',
    },
  ];

  const getCoachGreeting = () => {
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
            {getCoachGreeting()}{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Here's your coaching overview.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} dark:bg-opacity-20 flex items-center justify-center transition-transform hover:scale-110`}>
                  <Icon className={`w-5 h-5 ${stat.color} dark:opacity-90`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mb-6 sm:mb-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
          <CardDescription>Common tasks for your coaching workflow</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Button 
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all hover:scale-105"
            onClick={() => onNavigate('create')}
          >
            <Utensils className="w-4 h-4 mr-2" />
            Create New Meal Plan
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('clients')}
            className="w-full sm:w-auto hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-600 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all"
          >
            <Users className="w-4 h-4 mr-2" />
            View Clients
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onNavigate('history')}
            className="w-full sm:w-auto hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:border-teal-600 dark:hover:border-teal-500 hover:text-teal-700 dark:hover:text-teal-400 transition-all"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Plan History
          </Button>
        </CardContent>
      </Card>

      {/* Recent Plans */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-md hover:shadow-lg transition-all">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Recent Meal Plans</CardTitle>
          <CardDescription>Your latest client meal plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {recentPlans.map((plan, index) => (
              <div 
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20 hover:shadow-md transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-700"
                onClick={() => onNavigate('demo')}
              >
                <div className="flex-1 mb-3 sm:mb-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{plan.client}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {plan.goal} • <span className="font-medium">{plan.calories} cal/day</span>
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{plan.date}</span>
                  <span 
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      plan.status === 'Active' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}