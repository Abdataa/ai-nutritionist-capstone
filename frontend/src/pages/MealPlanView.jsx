import { useState, useEffect } from 'react';
import { Download, Share2, RotateCcw, ShoppingCart, Check, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import api from '../services/api';

export function MealPlanView({ mealPlanId, onRegenerate, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [macroData, setMacroData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [mealsByDay, setMealsByDay] = useState({});

  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/mealplan/${mealPlanId}`);
        const data = response.data;
        
        setMealPlan(data.mealplan);
        
        // Set macro data for pie chart
        setMacroData([
          { name: 'Protein', value: data.mealplan.macro_protein, color: '#10b981' },
          { name: 'Carbs', value: data.mealplan.macro_carbs, color: '#14b8a6' },
          { name: 'Fats', value: data.mealplan.macro_fats, color: '#f97316' },
        ]);
        
        // Parse meal history and organize by day
        const mealsByDayTemp = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        data.history.forEach((historyItem) => {
          const dayName = days[historyItem.day_number - 1];
          if (dayName) {
            try {
              const mealsData = JSON.parse(historyItem.meals_json);
              mealsByDayTemp[dayName] = mealsData.meals || [];
            } catch (e) {
              console.error('Error parsing meals for day', historyItem.day_number, e);
              mealsByDayTemp[dayName] = [];
            }
          }
        });
        
        setMealsByDay(mealsByDayTemp);
        
        // Generate weekly data for bar chart (simplified)
        const weeklyDataTemp = days.map((day) => ({
          day: day.substring(0, 3).charAt(0).toUpperCase() + day.substring(1, 3),
          protein: data.mealplan.macro_protein,
          carbs: data.mealplan.macro_carbs,
          fats: data.mealplan.macro_fats,
          calories: data.mealplan.daily_calories,
        }));
        
        setWeeklyData(weeklyDataTemp);
      } catch (err) {
        console.error('Error fetching meal plan:', err);
        setError('Failed to load meal plan. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (mealPlanId) {
      fetchMealPlan();
    }
  }, [mealPlanId]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Meal Plan',
          text: `Check out my ${mealPlan?.goal} meal plan - ${mealPlan?.daily_calories} calories per day!`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          alert('Unable to share. Please try copying the URL manually.');
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get(`/api/mealplan/pdf/${mealPlanId}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `meal-plan-${mealPlanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      alert('Failed to export PDF. This feature may not be available yet.');
    }
  };

  const handleRegeneratePlan = () => {
    if (onNavigate) {
      onNavigate('create');
    } else if (onRegenerate) {
      onRegenerate();
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading meal plan...</p>
        </div>
      </div>
    );
  }

  if (error || !mealPlan) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Meal plan not found'}</p>
          <Button onClick={() => onNavigate && onNavigate('history')}>Back to History</Button>
        </div>
      </div>
    );
  }

  // Mock data for macro breakdown
  const macroDataDisplay = macroData.length > 0 ? macroData : [
    { name: 'Protein', value: 180, color: '#10b981' },
    { name: 'Carbs', value: 250, color: '#14b8a6' },
    { name: 'Fats', value: 70, color: '#f97316' },
  ];

  const weeklyDataDisplay = weeklyData.length > 0 ? weeklyData : [
    { day: 'Mon', protein: 180, carbs: 250, fats: 70, calories: 2500 },
    { day: 'Tue', protein: 175, carbs: 260, fats: 68, calories: 2480 },
    { day: 'Wed', protein: 185, carbs: 245, fats: 72, calories: 2520 },
    { day: 'Thu', protein: 178, carbs: 255, fats: 69, calories: 2490 },
    { day: 'Fri', protein: 182, carbs: 248, fats: 71, calories: 2510 },
    { day: 'Sat', protein: 180, carbs: 250, fats: 70, calories: 2500 },
    { day: 'Sun', protein: 180, carbs: 250, fats: 70, calories: 2500 },
  ];

  const mealsByDayDisplay = Object.keys(mealsByDay).length > 0 ? mealsByDay : {
    monday: [
      { meal: 'Breakfast', name: 'Oatmeal with Berries & Almonds', calories: 450, protein: 15, carbs: 65, fats: 12 },
      { meal: 'Lunch', name: 'Grilled Chicken Quinoa Bowl', calories: 650, protein: 45, carbs: 70, fats: 18 },
      { meal: 'Snack', name: 'Greek Yogurt with Honey', calories: 200, protein: 20, carbs: 25, fats: 5 },
      { meal: 'Dinner', name: 'Salmon with Sweet Potato & Broccoli', calories: 700, protein: 50, carbs: 60, fats: 25 },
      { meal: 'Snack', name: 'Protein Shake', calories: 250, protein: 30, carbs: 15, fats: 8 },
    ],
    tuesday: [
      { meal: 'Breakfast', name: 'Scrambled Eggs with Avocado Toast', calories: 480, protein: 25, carbs: 45, fats: 22 },
      { meal: 'Lunch', name: 'Turkey & Spinach Wrap', calories: 550, protein: 40, carbs: 55, fats: 18 },
      { meal: 'Snack', name: 'Apple with Almond Butter', calories: 220, protein: 8, carbs: 28, fats: 12 },
      { meal: 'Dinner', name: 'Lean Beef Stir-Fry with Brown Rice', calories: 750, protein: 52, carbs: 75, fats: 20 },
      { meal: 'Snack', name: 'Cottage Cheese with Berries', calories: 180, protein: 22, carbs: 18, fats: 4 },
    ],
    wednesday: [
      { meal: 'Breakfast', name: 'Protein Pancakes with Blueberries', calories: 500, protein: 30, carbs: 60, fats: 15 },
      { meal: 'Lunch', name: 'Tuna Salad with Whole Grain Crackers', calories: 580, protein: 42, carbs: 50, fats: 20 },
      { meal: 'Snack', name: 'Mixed Nuts & Dried Fruit', calories: 250, protein: 8, carbs: 30, fats: 14 },
      { meal: 'Dinner', name: 'Grilled Chicken with Pasta & Vegetables', calories: 720, protein: 55, carbs: 68, fats: 22 },
      { meal: 'Snack', name: 'Casein Protein Shake', calories: 230, protein: 28, carbs: 12, fats: 6 },
    ],
  };

  const groceryList = {
    'Proteins': [
      'Chicken breast (2 lbs)',
      'Salmon fillets (1.5 lbs)',
      'Lean ground beef (1 lb)',
      'Turkey slices (1 lb)',
      'Eggs (18 count)',
      'Greek yogurt (32 oz)',
      'Cottage cheese (16 oz)',
      'Protein powder (optional)',
    ],
    'Carbohydrates': [
      'Oatmeal (2 lbs)',
      'Quinoa (1 lb)',
      'Brown rice (2 lbs)',
      'Sweet potatoes (4 large)',
      'Whole grain bread (1 loaf)',
      'Whole grain wraps (1 pack)',
      'Pasta (1 lb)',
    ],
    'Vegetables': [
      'Broccoli (2 heads)',
      'Spinach (1 bunch)',
      'Mixed bell peppers (4)',
      'Tomatoes (6)',
      'Cucumbers (2)',
      'Mixed salad greens',
      'Onions (3)',
      'Garlic (1 bulb)',
    ],
    'Fruits': [
      'Blueberries (1 pint)',
      'Strawberries (1 pint)',
      'Bananas (7)',
      'Apples (4)',
      'Avocados (3)',
    ],
    'Healthy Fats': [
      'Almonds (1 lb)',
      'Almond butter (1 jar)',
      'Olive oil (1 bottle)',
      'Mixed nuts (1 lb)',
    ],
    'Condiments & Other': [
      'Honey',
      'Soy sauce',
      'Balsamic vinegar',
      'Spices & herbs',
    ],
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-sm text-emerald-600 font-medium">Plan Generated</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">7-Day Meal Plan</h1>
          <p className="text-slate-600">{mealPlan.goal} • {mealPlan.diet_type} • {mealPlan.daily_calories} cal/day</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleRegeneratePlan}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>
      </div>

      {/* Macro Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="border-none shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-emerald-700 font-medium">Daily Protein</span>
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-900">{mealPlan.macro_protein}g</div>
            <p className="text-sm text-emerald-700 mt-1">{Math.round((mealPlan.macro_protein * 4 / mealPlan.daily_calories) * 100)}% of total calories</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-teal-50 to-teal-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-teal-700 font-medium">Daily Carbs</span>
              <Check className="w-5 h-5 text-teal-600" />
            </div>
            <div className="text-3xl font-bold text-teal-900">{mealPlan.macro_carbs}g</div>
            <p className="text-sm text-teal-700 mt-1">{Math.round((mealPlan.macro_carbs * 4 / mealPlan.daily_calories) * 100)}% of total calories</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-orange-700 font-medium">Daily Fats</span>
              <Check className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-orange-900">{mealPlan.macro_fats}g</div>
            <p className="text-sm text-orange-700 mt-1">{Math.round((mealPlan.macro_fats * 9 / mealPlan.daily_calories) * 100)}% of total calories</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Macro Breakdown Pie Chart */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Macro Distribution</CardTitle>
            <CardDescription>Daily macronutrient breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={macroDataDisplay}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroDataDisplay.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {macroDataDisplay.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-600">{item.name}: {item.value}g</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Calories Bar Chart */}
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle>Weekly Calorie Distribution</CardTitle>
            <CardDescription>Daily calorie targets across the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyDataDisplay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="calories" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Meal Plan Tabs */}
      <Card className="border-none shadow-md mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-600" />
            <CardTitle>7-Day Meal Schedule</CardTitle>
          </div>
          <CardDescription>Detailed daily meal breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monday" className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="monday">Mon</TabsTrigger>
              <TabsTrigger value="tuesday">Tue</TabsTrigger>
              <TabsTrigger value="wednesday">Wed</TabsTrigger>
              <TabsTrigger value="thursday">Thu</TabsTrigger>
              <TabsTrigger value="friday">Fri</TabsTrigger>
              <TabsTrigger value="saturday">Sat</TabsTrigger>
              <TabsTrigger value="sunday">Sun</TabsTrigger>
            </TabsList>
            <TabsContent value="monday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.monday || []} />
            </TabsContent>
            <TabsContent value="tuesday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.tuesday || []} />
            </TabsContent>
            <TabsContent value="wednesday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.wednesday || []} />
            </TabsContent>
            <TabsContent value="thursday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.thursday || []} />
            </TabsContent>
            <TabsContent value="friday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.friday || []} />
            </TabsContent>
            <TabsContent value="saturday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.saturday || []} />
            </TabsContent>
            <TabsContent value="sunday" className="mt-6">
              <MealDay meals={mealsByDayDisplay.sunday || []} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Grocery List */}
      <Card className="border-none shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-slate-600" />
              <CardTitle>Weekly Grocery List</CardTitle>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
          <CardDescription>Everything you need for the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(groceryList).map(([category, items]) => (
              <div key={category}>
                <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  {category}
                </h4>
                <ul className="space-y-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MealDay({ meals }) {
  return (
    <div className="space-y-4">
      {meals.map((meal, index) => (
        <div key={index} className="p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-150">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">{meal.meal}</span>
              <h4 className="font-semibold text-slate-900 mt-1">{meal.name}</h4>
            </div>
            <span className="text-sm font-semibold text-slate-900">{meal.calories} cal</span>
          </div>
          <div className="flex gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              P: {meal.protein}g
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              C: {meal.carbs}g
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              F: {meal.fats}g
            </span>
          </div>
        </div>
      ))}
      <div className="pt-4 border-t">
        <div className="flex justify-between text-sm">
          <span className="font-semibold text-slate-900">Daily Total</span>
          <span className="font-semibold text-slate-900">
            {meals.reduce((sum, meal) => sum + meal.calories, 0)} calories
          </span>
        </div>
      </div>
    </div>
  );
}
