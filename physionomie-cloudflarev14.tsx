function TherapiesManagement({ therapies, setTherapies, showAdd, setShowAdd, editing, setEditing }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Therapie-Verwaltung</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg transition text-sm sm:text-base"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Hinzufügen
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {therapies.map((therapy) => (
          <div key={therapy.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 min-w-0 w-full">
                <div className="font-bold text-base sm:text-xl text-gray-900 mb-2 break-words">{therapy.name}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-3 sm:mb-4">
                  {therapy.time} Min • {therapy.category === 'main' ? '⭐ Haupttherapie' : '🔧 Nebentherapie'}
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-2 sm:p-4">
                    <div className="text-xs text-gray-600 font-bold mb-1 uppercase">GKV</div>
                    <div className="text-base sm:text-xl font-bold text-blue-600 truncate">{therapy.bonuses.GZV.toFixed(2)}€</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-2 sm:p-4">
                    <div className="text-xs text-gray-600 font-bold mb-1 uppercase">Beihilfe</div>
                    <div className="text-base sm:text-xl font-bold text-green-600 truncate">{therapy.bonuses.BH.toFixed(2)}€</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-2 sm:p-4">
                    <div className="text-xs text-gray-600 font-bold mb-1 uppercase">Privat</div>
                    <div className="text-base sm:text-xl font-bold text-red-600 truncate">{therapy.bonuses.P.toFixed(2)}€</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                <button 
                  onClick={() => setEditing(therapy)} 
                  className="text-blue-600 hover:text-blue-700 transition p-2"
                >
                  <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Therapie wirklich löschen?')) {
                      setTherapies(therapies.filter(t => t.id !== therapy.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-700 transition p-2"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAdd || editing) && (
        <TherapyModal
          therapy={editing}
          onSave={async (data) => {
            if (editing) {
              const updated = therapies.map(t => t.id === editing.id ? { ...t, ...data } : t);
              await setTherapies(updated);
              setEditing(null);
            } else {
              const newTherapy = { id: Date.now(), ...data };
              const updated = [...therapies, newTherapy];
              await setTherapies(updated);
              setShowAdd(false);
            }
          }}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function TherapyModal({ therapy, onSave, onClose }) {
  const [gkvPrice, setGkvPrice] = useState(therapy ? therapy.bonuses.GZV : 0);
  const [formData, setFormData] = useState(therapy || {
    name: '',
    time: 20,
    category: 'main'
  });

  const calculatedPrices = useMemo(() => calculatePrices(gkvPrice), [gkvPrice]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      bonuses: calculatedPrices
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-blue-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
              {therapy ? 'Therapie bearbeiten' : 'Neue Therapie'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition flex-shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Name der Therapie</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-blue-500 transition"
              required
              placeholder="z.B. Krankengymnastik"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Dauer (Minuten)</label>
            <input
              type="number"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: Number(e.target.value) })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-blue-500 transition"
              required
              min="5"
              step="5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Kategorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="main">⭐ Haupttherapie</option>
              <option value="secondary">🔧 Nebentherapie</option>
            </select>
          </div>
          
          <div className="border-t-2 border-gray-200 pt-4 sm:pt-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">GKV-Preis (€)</label>
              <input
                type="number"
                step="0.01"
                value={gkvPrice}
                onChange={(e) => setGkvPrice(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-base sm:text-lg text-gray-900 focus:outline-none focus:border-blue-500 transition font-bold"
                required
                placeholder="0.00"
              />
            </div>
            
            <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">GKV</span>
                  <span className="text-lg sm:text-xl font-bold text-blue-600">{calculatedPrices.GZV.toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className="text-sm font-bold text-gray-900">Beihilfe</span>
                    <span className="text-xs text-gray-600 ml-2">(GKV × 1.4)</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-green-600 whitespace-nowrap">{calculatedPrices.BH.toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4">
                <div className="flex justify-between items-center gap-2">
                  <div>
                    <span className="text-sm font-bold text-gray-900">Privat</span>
                    <span className="text-xs text-gray-600 ml-2">(GKV × 1.5)</span>
                  </div>
                  <span className="text-lg sm:text-xl font-bold text-red-600 whitespace-nowrap">{calculatedPrices.P.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2.5 sm:py-3 rounded-xl transition text-sm sm:text-base"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TherapistDashboard({ therapist, therapies, activities, setActivities, onLogout }) {
  const [activeView, setActiveView] = useState('tracker');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  const todayActivities = useMemo(() => {
    if (!activities[selectedDate]) return [];
    return activities[selectedDate][therapist.id] || [];
  }, [activities, selectedDate, therapist.id]);

  const addActivity = async (therapy, kasse) => {
    const newActivity = {
      id: Date.now() + Math.random(),
      therapyId: therapy.id,
      name: therapy.name,
      time: therapy.time,
      kasse: kasse,
      bonus: therapy.bonuses[kasse],
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedActivities = { ...activities };
    if (!updatedActivities[selectedDate]) {
      updatedActivities[selectedDate] = {};
    }
    if (!updatedActivities[selectedDate][therapist.id]) {
      updatedActivities[selectedDate][therapist.id] = [];
    }
    
    updatedActivities[selectedDate][therapist.id] = [...updatedActivities[selectedDate][therapist.id], newActivity];
    await setActivities(updatedActivities);
    setSelectedTherapy(null);
    setShowAddActivity(false);
  };

  const removeActivity = async (activityId) => {
    const updatedActivities = { ...activities };
    if (updatedActivities[selectedDate] && updatedActivities[selectedDate][therapist.id]) {
      updatedActivities[selectedDate][therapist.id] = updatedActivities[selectedDate][therapist.id].filter(a => a.id !== activityId);
      await setActivities(updatedActivities);
    }
  };

  const dailyStats = useMemo(() => {
    const totalTime = todayActivities.reduce((sum, a) => sum + a.time, 0);
    const bonus = todayActivities.reduce((sum, a) => sum + a.bonus, 0);

    return {
      totalTime,
      hours: Math.floor(totalTime / 60),
      minutes: totalTime % 60,
      bonus: bonus.toFixed(2),
      count: todayActivities.length
    };
  }, [todayActivities]);

  const allTimeStats = useMemo(() => {
    const allActivities = Object.values(activities).flatMap(dateActivities =>
      (dateActivities[therapist.id] || [])
    );

    const totalBonus = allActivities.reduce((sum, a) => sum + a.bonus, 0);
    const totalTime = allActivities.reduce((sum, a) => sum + a.time, 0);

    return {
      totalBonus: totalBonus.toFixed(2),
      totalHours: Math.floor(totalTime / 60),
      totalActivities: allActivities.length
    };
  }, [activities, therapist.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Logo className="w-20 sm:w-32 h-auto max-h-12" />
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-2xl font-bold text-gray-900 truncate">Hallo, {therapist.name}! 👋</h1>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold truncate">Bonusanteil: {therapist.revenuePercent}%</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 sm:gap-2 font-semibold shadow-lg text-xs sm:text-base whitespace-nowrap"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8">
          <button
            onClick={() => setActiveView('tracker')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition font-semibold text-xs sm:text-base ${
              activeView === 'tracker' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Aktivitäten</span>
          </button>
          <button
            onClick={() => setActiveView('statistics')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition font-semibold text-xs sm:text-base ${
              activeView === 'statistics' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Statistiken</span>
          </button>
        </div>

        {activeView === 'tracker' && (
          <TrackerView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            todayActivities={todayActivities}
            dailyStats={dailyStats}
            therapies={therapies}
            showAddActivity={showAddActivity}
            setShowAddActivity={setShowAddActivity}
            selectedTherapy={selectedTherapy}
            setSelectedTherapy={setSelectedTherapy}
            addActivity={addActivity}
            removeActivity={removeActivity}
          />
        )}

        {activeView === 'statistics' && (
          <StatisticsView
            therapist={therapist}
            allTimeStats={allTimeStats}
          />
        )}
      </div>
    </div>
  );
}

function TrackerView({ selectedDate, setSelectedDate, todayActivities, dailyStats, therapies, showAddActivity, setShowAddActivity, selectedTherapy, setSelectedTherapy, addActivity, removeActivity }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid sm:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 font-bold mb-2 uppercase">💰 Bonus heute</div>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 truncate">{dailyStats.bonus}€</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">{dailyStats.count} Therapien</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 font-bold mb-2 uppercase">⏱️ Arbeitszeit</div>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900">{dailyStats.hours}:{dailyStats.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">Stunden</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="text-xs sm:text-sm text-gray-600 font-bold mb-2 uppercase">📅 Datum</div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-900 font-bold focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <h3 className="text-base sm:text-xl font-bold text-gray-900 break-words">Aktivitäten am {new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE')}</h3>
          <button
            onClick={() => setShowAddActivity(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg transition text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            Hinzufügen
          </button>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {todayActivities.length === 0 ? (
            <div className="text-center py-8 sm:py-12 text-gray-500">
              <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 opacity-30" />
              <p className="text-base sm:text-lg font-semibold">Noch keine Therapien erfasst</p>
              <p className="text-xs sm:text-sm mt-2">Klicken Sie auf "Hinzufügen" um zu starten</p>
            </div>
          ) : (
            todayActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 border border-gray-200 hover:shadow-md transition"
              >
                <div className={`w-1 sm:w-2 h-12 sm:h-14 rounded-full flex-shrink-0 ${
                  activity.kasse === 'GZV' ? 'bg-blue-500' : activity.kasse === 'BH' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm sm:text-base text-gray-900 truncate">{activity.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 font-medium truncate">
                    {activity.kasse === 'GZV' ? 'GKV' : activity.kasse === 'BH' ? 'Beihilfe' : 'Privat'} • {activity.time} Min • {activity.timestamp}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-lg sm:text-2xl font-bold text-green-600 whitespace-nowrap">
                    {activity.bonus.toFixed(2)}€
                  </div>
                  <div className="text-xs text-gray-600 font-semibold uppercase">Bonus</div>
                </div>
                <button
                  onClick={() => removeActivity(activity.id)}
                  className="text-red-600 hover:text-red-700 transition p-2 flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddActivity && !selectedTherapy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-blue-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Therapie wählen</h2>
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="text-white hover:text-gray-200 transition flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-2 sm:space-y-3" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {therapies.map((therapy) => (
                <button
                  key={therapy.id}
                  onClick={() => setSelectedTherapy(therapy)}
                  className="w-full bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 rounded-xl p-4 sm:p-5 transition flex items-center justify-between text-left border border-gray-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="font-bold text-base sm:text-lg text-gray-900 mb-1 sm:mb-2 break-words">{therapy.name}</div>
                    <div className="text-xs sm:text-sm text-gray-600 font-medium">
                      ⏱️ {therapy.time} Min • {therapy.category === 'main' ? '⭐ Haupttherapie' : '🔧 Nebentherapie'}
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold flex-shrink-0">
                    <span className="text-xs sm:text-sm">Kasse wählen →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddActivity && selectedTherapy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border-4 border-blue-200 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6">
              <button
                onClick={() => setSelectedTherapy(null)}
                className="flex items-center gap-2 text-white hover:text-gray-200 mb-3 sm:mb-4 transition font-semibold text-sm sm:text-base"
              >
                ← Zurück
              </button>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 break-words">{selectedTherapy.name}</h2>
              <p className="text-white/90 text-xs sm:text-sm font-medium">⏱️ {selectedTherapy.time} Minuten</p>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">function TherapiesManagement({ therapies, setTherapies, showAdd, setShowAdd, editing, setEditing }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Therapie-Verwaltung</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg transition text-sm sm:text-base"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Hinzufügen
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {therapies.map((therapy) => (
          <div key={therapy.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex-1 min-w-0 w-full">
                <div className="font-bold text-base sm:text-xl text-gray-900 mb-2 break-words">{therapy.name}</div>
                <div className="text-xs sm:text-sm text-gray-600 font-medium mb-3 sm:mb-4">
                  {therapy.time} Min • {therapy.category === 'main' ? '      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Therapeuten-Performance</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setSelectedTimeframe('week')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                selectedTimeframe === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Woche
            </button>
            <button
              onClick={() => setSelectedTimeframe('month')}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
                selectedTimeframe === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monat
            </button>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {businessMetrics.therapistData.map((therapist, index) => {
            const avgPerTherapy = therapist.activityCount > 0 
              ? (therapist.revenue / therapist.activityCount).toFixed(2)
              : '0.00';
            const targetProgress = therapist.bonusTarget > 0 
              ? ((therapist.revenue / therapist.bonusTarget) * 100).toFixed(1)
              : '0.0';

            return (
              <div
                key={therapist.id}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-3 sm:p-6 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className={`text-2xl sm:text-3xl font-bold w-10 sm:w-14 text-center flex-shrink-0 ${
                    index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-500'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-base sm:text-xl font-bold text-white shadow-lg flex-shrink-0">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-base sm:text-xl font-bold text-gray-900 truncate">{therapist.name}</div>
                        <div className="text-xs sm:text-sm text-gray-600 font-medium truncate">
                          {therapist.revenuePercent}% Bonusanteil • {therapist.activityCount} Therapien
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Bonus</div>
                        <div className="text-xl sm:text-3xl font-bold text-green-600 whitespace-nowrap">{therapist.revenue.toFixed(2)}€</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4">
                      <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border border-blue-200">
                        <div className="text-xs text-gray-600 font-bold uppercase mb-1 truncate">Ø Therapie</div>
                        <div className="text-sm sm:text-lg font-bold text-blue-600 truncate">{avgPerTherapy}€</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-2 sm:p-3 border border-purple-200">
                        <div className="text-xs text-gray-600 font-bold uppercase mb-1 truncate">Fortschritt</div>
                        <div className="text-sm sm:text-lg font-bold text-purple-600 truncate">{targetProgress}%</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-2 sm:p-3 border border-green-200">
                        <div className="text-xs text-gray-600 font-bold uppercase mb-1 truncate">Noch offen</div>
                        <div className="text-sm sm:text-lg font-bold text-green-600 truncate">
                          {Math.max(0, therapist.bonusTarget - therapist.revenue).toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 sm:h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(parseFloat(targetProgress), 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0€</span>
                        <span>{therapist.bonusTarget}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 sm:p-6 shadow-lg border-2 border-blue-200">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-base sm:text-lg">🤖</span>
          </div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900">KI-Analysen & Empfehlungen</h3>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <div className="bg-white rounded-xl p-3 sm:p-4 border border-blue-200">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-xs sm:text-sm">✓</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm sm:text-base text-gray-900 mb-1">Top Performer identifiziert</div>
                <div className="text-xs sm:text-sm text-gray-700 break-words">
                  {businessMetrics.therapistData[0]?.name || 'Kein Therapeut'} führt mit {businessMetrics.therapistData[0]?.revenue.toFixed(2) || '0.00'}€ Bonus. 
                  Durchschnitt pro Therapie: {businessMetrics.therapistData[0]?.activityCount > 0 
                    ? (businessMetrics.therapistData[0].revenue / businessMetrics.therapistData[0].activityCount).toFixed(2) 
                    : '0.00'}€
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 border border-orange-200">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 font-bold text-xs sm:text-sm">!</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm sm:text-base text-gray-900 mb-1">Optimierungspotential erkannt</div>
                <div className="text-xs sm:text-sm text-gray-700 break-words">
                  {businessMetrics.therapistData.filter(t => t.revenue < t.bonusTarget).length} Therapeuten 
                  haben ihr Bonusziel noch nicht erreicht. Durchschnittliche Lücke: {
                    businessMetrics.therapistData.filter(t => t.revenue < t.bonusTarget).length > 0
                      ? (businessMetrics.therapistData
                          .filter(t => t.revenue < t.bonusTarget)
                          .reduce((sum, t) => sum + (t.bonusTarget - t.revenue), 0) / 
                          businessMetrics.therapistData.filter(t => t.revenue < t.bonusTarget).length
                        ).toFixed(2)
                      : '0.00'
                  }€
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-3 sm:p-4 border border-purple-200">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-xs sm:text-sm">💡</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm sm:text-base text-gray-900 mb-1">Empfehlung: Fokus auf hochwertige Therapien</div>
                <div className="text-xs sm:text-sm text-gray-700 break-words">
                  Priorisieren Sie Manuelle Therapie und Lymphdrainage für höhere Bonuserträge. 
                  Diese Therapien zeigen die beste Rentabilität pro Zeiteinheit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}import React, { useState, useEffect, useMemo } from 'react';
import { LogIn, LogOut, BarChart3, Users, Settings, Plus, Trash2, Edit2, Calendar, Download, X, Save, TrendingUp } from 'lucide-react';

// Storage-Schlüssel
const STORAGE_KEYS = {
  THERAPISTS: 'app:therapists',
  THERAPIES: 'app:therapies',
  ACTIVITIES: 'app:activities',
  CURRENT_USER: 'app:current_user'
};

// Preisberechnung: Beihilfe = GKV * 1.4, Privat = GKV * 1.5
const calculatePrices = (gkvPrice) => ({
  GZV: gkvPrice,
  BH: gkvPrice * 1.4,
  P: gkvPrice * 1.5
});

const INITIAL_THERAPIES = [
  { id: 1, name: "Krankengymnastik (KG)", time: 20, category: "main", bonuses: calculatePrices(9.25) },
  { id: 2, name: "KG Gerätetraining (KGG)", time: 30, category: "main", bonuses: calculatePrices(17.42) },
  { id: 3, name: "Manuelle Therapie (MT)", time: 20, category: "main", bonuses: calculatePrices(11.11) },
  { id: 4, name: "Klassische Massagetherapie (KMT)", time: 30, category: "main", bonuses: calculatePrices(6.75) },
  { id: 5, name: "Manuelle Lymphdrainage (MLD30)", time: 30, category: "main", bonuses: calculatePrices(11.23) },
  { id: 6, name: "Manuelle Lymphdrainage (MLD45)", time: 45, category: "main", bonuses: calculatePrices(16.84) },
  { id: 7, name: "Manuelle Lymphdrainage (MLD60)", time: 60, category: "main", bonuses: calculatePrices(22.46) },
  { id: 8, name: "Fango-Packung", time: 10, category: "secondary", bonuses: calculatePrices(5.05) },
  { id: 9, name: "Kältetherapie", time: 10, category: "secondary", bonuses: calculatePrices(3.73) },
  { id: 10, name: "Heiße Rolle", time: 10, category: "secondary", bonuses: calculatePrices(4.20) },
];

const INITIAL_THERAPISTS = [
  { id: 1, name: "Anna Müller", email: "anna.mueller@praxis.de", password: "therapeut123", bonusTarget: 3000, revenuePercent: 32 },
  { id: 2, name: "Tom Schmidt", email: "tom.schmidt@praxis.de", password: "therapeut123", bonusTarget: 3500, revenuePercent: 34 },
  { id: 3, name: "Lisa Weber", email: "lisa.weber@praxis.de", password: "therapeut123", bonusTarget: 2800, revenuePercent: 36 },
];

function Logo({ className = "" }) {
  return (
    <img
      loading="lazy"
      src="https://cdn.prod.website-files.com/67ffaa8b5dde3d7e0de3a8cb/67ffaa8b5dde3d7e0de3a8d9_Physonomie%20Logo.svg"
      alt="Physionomie Logo"
      className={`transition-all duration-300 object-contain ${className}`}
    />
  );
}

function PWAInstallBanner({ onDismiss }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      onDismiss();
    }
  };

  if (!deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 w-full max-w-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-5 shadow-2xl z-50 mx-4">
      <div className="flex items-start gap-3">
        <Download className="w-6 h-6 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-1 truncate">App installieren</h3>
          <p className="text-sm text-white/90 mb-3 break-words">
            Installieren Sie Physionomie als App für schnelleren Zugriff
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleInstall}
              className="flex-1 bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition truncate"
            >
              Installieren
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10 transition truncate"
            >
              Später
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BonusManagementSystem() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPWABanner, setShowPWABanner] = useState(true);
  
  const [therapists, setTherapists] = useState(INITIAL_THERAPISTS);
  const [therapies, setTherapies] = useState(INITIAL_THERAPIES);
  const [activities, setActivities] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const therapistsResult = await window.storage.get(STORAGE_KEYS.THERAPISTS);
        if (therapistsResult) {
          setTherapists(JSON.parse(therapistsResult.value));
        } else {
          await window.storage.set(STORAGE_KEYS.THERAPISTS, JSON.stringify(INITIAL_THERAPISTS));
        }

        const therapiesResult = await window.storage.get(STORAGE_KEYS.THERAPIES);
        if (therapiesResult) {
          setTherapies(JSON.parse(therapiesResult.value));
        } else {
          await window.storage.set(STORAGE_KEYS.THERAPIES, JSON.stringify(INITIAL_THERAPIES));
        }

        const activitiesResult = await window.storage.get(STORAGE_KEYS.ACTIVITIES);
        if (activitiesResult) {
          setActivities(JSON.parse(activitiesResult.value));
        }

        const userResult = await window.storage.get(STORAGE_KEYS.CURRENT_USER);
        if (userResult) {
          const userData = JSON.parse(userResult.value);
          setUser(userData);
          setUserRole(userData.role);
          setShowLogin(false);
        }
      } catch (error) {
        console.log('Erste Initialisierung');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const saveTherapists = async (newTherapists) => {
    setTherapists(newTherapists);
    await window.storage.set(STORAGE_KEYS.THERAPISTS, JSON.stringify(newTherapists));
  };

  const saveTherapies = async (newTherapies) => {
    setTherapies(newTherapies);
    await window.storage.set(STORAGE_KEYS.THERAPIES, JSON.stringify(newTherapies));
  };

  const saveActivities = async (newActivities) => {
    setActivities(newActivities);
    await window.storage.set(STORAGE_KEYS.ACTIVITIES, JSON.stringify(newActivities));
  };

  const handleLogin = async (email, password) => {
    let userData = null;
    let role = null;

    if (email === 'admin@praxis.de' && password === 'admin123') {
      userData = { email, name: 'Administrator', role: 'admin', id: 999 };
      role = 'admin';
    } else {
      const therapist = therapists.find(t => t.email === email && t.password === password);
      if (therapist) {
        userData = { ...therapist, role: 'therapist' };
        role = 'therapist';
      } else {
        alert('Ungültige Anmeldedaten.');
        return;
      }
    }

    if (userData && role) {
      setUser(userData);
      setUserRole(role);
      if (rememberMe) {
        await window.storage.set(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));
      }
      setShowLogin(false);
    }
  };

  const handleLogout = async () => {
    await window.storage.delete(STORAGE_KEYS.CURRENT_USER);
    setUser(null);
    setUserRole(null);
    setShowLogin(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Logo className="w-40 h-auto mx-auto mb-4" />
          <div className="text-xl text-gray-700 font-semibold">Wird geladen...</div>
        </div>
      </div>
    );
  }

  if (showLogin) {
    return <LoginScreen onLogin={handleLogin} rememberMe={rememberMe} setRememberMe={setRememberMe} />;
  }

  return (
    <>
      {showPWABanner && <PWAInstallBanner onDismiss={() => setShowPWABanner(false)} />}
      {userRole === 'admin' ? (
        <AdminDashboard
          therapists={therapists}
          setTherapists={saveTherapists}
          therapies={therapies}
          setTherapies={saveTherapies}
          activities={activities}
          onLogout={handleLogout}
        />
      ) : (
        <TherapistDashboard
          therapist={user}
          therapies={therapies}
          activities={activities}
          setActivities={saveActivities}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}

function LoginScreen({ onLogin, rememberMe, setRememberMe }) {
  const [email, setEmail] = useState('ihre.mail@physionomie.de');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }
    onLogin(email, password);
  };

  const quickLogin = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setTimeout(() => onLogin(userEmail, userPassword), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-white pt-8 sm:pt-12 pb-6 sm:pb-8 flex justify-center px-4 sm:px-8">
            <Logo className="w-40 sm:w-48 h-auto max-h-20" />
          </div>

          <form onSubmit={handleSubmit} className="px-4 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-800 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-sm font-semibold break-words">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre.mail@physionomie.de"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm sm:text-base font-bold text-gray-900 mb-2">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-gray-300"
              />
              <label htmlFor="remember" className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">
                Angemeldet bleiben
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 sm:py-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              Anmelden
            </button>

            <div className="text-center pt-4 sm:pt-6 space-y-2 sm:space-y-3">
              <div className="font-bold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Demo-Zugänge:</div>
              <button
                type="button"
                onClick={() => quickLogin('admin@praxis.de', 'admin123')}
                className="w-full bg-blue-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4 hover:bg-blue-100 transition text-left"
              >
                <div className="font-bold text-gray-900 text-sm sm:text-base">Admin</div>
                <div className="text-xs sm:text-sm text-gray-600 truncate">admin@praxis.de / admin123</div>
              </button>
              <button
                type="button"
                onClick={() => quickLogin('anna.mueller@praxis.de', 'therapeut123')}
                className="w-full bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 hover:bg-green-100 transition text-left"
              >
                <div className="font-bold text-gray-900 text-sm sm:text-base">Therapeut</div>
                <div className="text-xs sm:text-sm text-gray-600 truncate">anna.mueller@praxis.de / therapeut123</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ therapists, setTherapists, therapies, setTherapies, activities, onLogout }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [showAddTherapist, setShowAddTherapist] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState(null);
  const [showAddTherapy, setShowAddTherapy] = useState(false);
  const [editingTherapy, setEditingTherapy] = useState(null);

  const businessMetrics = useMemo(() => {
    const allActivities = Object.values(activities).flatMap(dateActivities =>
      Object.values(dateActivities).flat()
    );

    const totalRevenue = allActivities.reduce((sum, activity) => {
      const therapy = therapies.find(t => t.id === activity.therapyId);
      if (!therapy) return sum;
      return sum + therapy.bonuses[activity.kasse];
    }, 0);

    const therapistData = therapists.map(therapist => {
      const therapistActivities = Object.values(activities).flatMap(dateActivities =>
        (dateActivities[therapist.id] || [])
      );

      const revenue = therapistActivities.reduce((sum, activity) => {
        const therapy = therapies.find(t => t.id === activity.therapyId);
        if (!therapy) return sum;
        return sum + therapy.bonuses[activity.kasse];
      }, 0);

      return {
        ...therapist,
        revenue,
        activityCount: therapistActivities.length
      };
    });

    return {
      totalRevenue: totalRevenue.toFixed(2),
      therapistData: therapistData.sort((a, b) => b.revenue - a.revenue)
    };
  }, [activities, therapies, therapists]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Logo className="w-20 sm:w-32 h-auto max-h-12" />
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-2xl font-bold text-gray-900 truncate">Admin Dashboard</h1>
                <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">Verwaltung & Analysen</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition flex items-center gap-1 sm:gap-2 font-semibold shadow-lg text-xs sm:text-base whitespace-nowrap"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-8">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition font-semibold text-xs sm:text-base ${
              activeTab === 'analytics' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Analysen</span>
          </button>
          <button
            onClick={() => setActiveTab('therapists')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition font-semibold text-xs sm:text-base ${
              activeTab === 'therapists' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Therapeuten</span>
          </button>
          <button
            onClick={() => setActiveTab('therapies')}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition font-semibold text-xs sm:text-base ${
              activeTab === 'therapies' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 inline mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Therapien</span>
          </button>
        </div>

        {activeTab === 'analytics' && <AnalyticsView businessMetrics={businessMetrics} therapists={therapists} />}
        {activeTab === 'therapists' && (
          <TherapistsManagement
            therapists={therapists}
            setTherapists={setTherapists}
            showAdd={showAddTherapist}
            setShowAdd={setShowAddTherapist}
            editing={editingTherapist}
            setEditing={setEditingTherapist}
          />
        )}
        {activeTab === 'therapies' && (
          <TherapiesManagement
            therapies={therapies}
            setTherapies={setTherapies}
            showAdd={showAddTherapy}
            setShowAdd={setShowAddTherapy}
            editing={editingTherapy}
            setEditing={setEditingTherapy}
          />
        )}
      </div>
    </div>
  );
}

function AnalyticsView({ businessMetrics, therapists }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-semibold uppercase break-words">Gesamtumsatz</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 truncate">{businessMetrics.totalRevenue}€</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Aktueller Monat</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-semibold uppercase break-words">Bonus</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 truncate">{businessMetrics.totalRevenue}€</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Alle Therapeuten</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-semibold uppercase break-words">Aktive Therapeuten</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 truncate">{therapists.length}</div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Im System</div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-semibold uppercase break-words">Ø pro Therapie</div>
          </div>
          <div className="text-2xl sm:text-4xl font-bold text-gray-900 truncate">
            {businessMetrics.therapistData.reduce((sum, t) => sum + t.activityCount, 0) > 0 
              ? (parseFloat(businessMetrics.totalRevenue) / businessMetrics.therapistData.reduce((sum, t) => sum + t.activityCount, 0)).toFixed(2)
              : '0.00'}€
          </div>
          <div className="text-xs sm:text-sm text-gray-500 mt-1 truncate">Durchschnitt</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Therapeuten-Performance</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedTimeframe('week')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedTimeframe === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Woche
            </button>
            <button
              onClick={() => setSelectedTimeframe('month')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                selectedTimeframe === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monat
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {businessMetrics.therapistData.map((therapist, index) => {
            const avgPerTherapy = therapist.activityCount > 0 
              ? (therapist.revenue / therapist.activityCount).toFixed(2)
              : '0.00';
            const targetProgress = therapist.bonusTarget > 0 
              ? ((therapist.revenue / therapist.bonusTarget) * 100).toFixed(1)
              : '0.0';

            return (
              <div
                key={therapist.id}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-start gap-4">
                  <div className={`text-3xl font-bold w-14 text-center ${
                    index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-500'
                  }`}>
                    #{index + 1}
                  </div>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xl font-bold text-gray-900">{therapist.name}</div>
                        <div className="text-sm text-gray-600 font-medium">
                          {therapist.revenuePercent}% Bonusanteil • {therapist.activityCount} Therapien
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Bonus</div>
                        <div className="text-3xl font-bold text-green-600">{therapist.revenue.toFixed(2)}€</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <div className="text-xs text-gray-600 font-bold uppercase mb-1">Ø pro Therapie</div>
                        <div className="text-lg font-bold text-blue-600">{avgPerTherapy}€</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                        <div className="text-xs text-gray-600 font-bold uppercase mb-1">Zielfortschritt</div>
                        <div className="text-lg font-bold text-purple-600">{targetProgress}%</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="text-xs text-gray-600 font-bold uppercase mb-1">Noch zu erreichen</div>
                        <div className="text-lg font-bold text-green-600">
                          {Math.max(0, therapist.bonusTarget - therapist.revenue).toFixed(2)}€
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(parseFloat(targetProgress), 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0€</span>
                        <span>{therapist.bonusTarget}€</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 shadow-lg border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🤖</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">KI-Analysen & Empfehlungen</h3>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">✓</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Top Performer identifiziert</div>
                <div className="text-sm text-gray-700">
                  {businessMetrics.therapistData[0]?.name || 'Kein Therapeut'} führt mit {businessMetrics.therapistData[0]?.revenue.toFixed(2) || '0.00'}€ Bonus. 
                  Durchschnitt pro Therapie: {businessMetrics.therapistData[0]?.activityCount > 0 
                    ? (businessMetrics.therapistData[0].revenue / businessMetrics.therapistData[0].activityCount).toFixed(2) 
                    : '0.00'}€
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-orange-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-orange-600 font-bold text-sm">!</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Optimierungspotential erkannt</div>
                <div className="text-sm text-gray-700">
                  {businessMetrics.therapistData.filter(t => t.revenue < t.bonusTarget).length} Therapeuten 
                  haben ihr Bonusziel noch nicht erreicht. Durchschnittliche Lücke: {
                    businessMetrics.therapistData.filter(t => t.revenue < t.bonusTarget).length > 0
                      ? (businessMetrics.therapistData
                          .filter(t => t.revenue < t.bonusTarget)
                          .reduce((sum, t) => sum + (t.bonusTarget - t.revenue), 0) / 
                          businessMetrics.therapistData.filter(t => t.revenue < t.bonusTarget).length
                        ).toFixed(2)
                      : '0.00'
                  }€
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 font-bold text-sm">💡</span>
              </div>
              <div>
                <div className="font-bold text-gray-900 mb-1">Empfehlung: Fokus auf hochwertige Therapien</div>
                <div className="text-sm text-gray-700">
                  Priorisieren Sie Manuelle Therapie und Lymphdrainage für höhere Bonuserträge. 
                  Diese Therapien zeigen die beste Rentabilität pro Zeiteinheit.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TherapistsManagement({ therapists, setTherapists, showAdd, setShowAdd, editing, setEditing }) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Therapeuten-Verwaltung</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold shadow-lg transition text-sm sm:text-base"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
          Hinzufügen
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {therapists.map((therapist) => (
          <div key={therapist.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-base sm:text-lg font-bold text-white flex-shrink-0">
                {therapist.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm sm:text-base text-gray-900 truncate">{therapist.name}</div>
                <div className="text-xs text-gray-600 truncate">{therapist.email}</div>
              </div>
              <button 
                onClick={() => setEditing(therapist)}
                className="text-blue-600 hover:text-blue-700 transition flex-shrink-0"
              >
                <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium">Bonusziel:</span>
                <span className="font-bold text-green-600">{therapist.bonusTarget}€</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600 font-medium">Bonusanteil:</span>
                <span className="font-bold text-blue-600">{therapist.revenuePercent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAdd || editing) && (
        <TherapistModal
          therapist={editing}
          onSave={async (data) => {
            if (editing) {
              const updated = therapists.map(t => t.id === editing.id ? { ...t, ...data } : t);
              await setTherapists(updated);
              setEditing(null);
            } else {
              const newTherapist = { id: Date.now(), ...data, password: 'therapeut123' };
              const updated = [...therapists, newTherapist];
              await setTherapists(updated);
              setShowAdd(false);
            }
          }}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function TherapistModal({ therapist, onSave, onClose }) {
  const [formData, setFormData] = useState(therapist || {
    name: '',
    email: '',
    bonusTarget: 3000,
    revenuePercent: 32
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-blue-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-6 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
              {therapist ? 'Therapeut bearbeiten' : 'Neuer Therapeut'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition flex-shrink-0">
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">E-Mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:border-blue-500 transition break-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Bonusziel: {formData.bonusTarget}€</label>
            <input
              type="range"
              min="1000"
              max="6000"
              step="100"
              value={formData.bonusTarget}
              onChange={(e) => setFormData({ ...formData, bonusTarget: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Bonusanteil: {formData.revenuePercent}%</label>
            <input
              type="range"
              min="30"
              max="40"
              value={formData.revenuePercent}
              onChange={(e) => setFormData({ ...formData, revenuePercent: Number(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2.5 sm:py-3 rounded-xl transition text-sm sm:text-base"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 sm:py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Save className="w-3 h-3 sm:w-4 sm:h-4" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TherapiesManagement({ therapies, setTherapies, showAdd, setShowAdd, editing, setEditing }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Therapie-Verwaltung</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          Hinzufügen
        </button>
      </div>

      <div className="space-y-4">
        {therapies.map((therapy) => (
          <div key={therapy.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="font-bold text-xl text-gray-900 mb-2">{therapy.name}</div>
                <div className="text-sm text-gray-600 font-medium mb-4">
                  {therapy.time} Min • {therapy.category === 'main' ? '⭐ Haupttherapie' : '🔧 Nebentherapie'}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="text-xs text-gray-600 font-bold mb-1 uppercase">GKV</div>
                    <div className="text-xl font-bold text-blue-600">{therapy.bonuses.GZV.toFixed(2)}€</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-xs text-gray-600 font-bold mb-1 uppercase">Beihilfe</div>
                    <div className="text-xl font-bold text-green-600">{therapy.bonuses.BH.toFixed(2)}€</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="text-xs text-gray-600 font-bold mb-1 uppercase">Privat</div>
                    <div className="text-xl font-bold text-red-600">{therapy.bonuses.P.toFixed(2)}€</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-6">
                <button 
                  onClick={() => setEditing(therapy)} 
                  className="text-blue-600 hover:text-blue-700 transition p-2"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Therapie wirklich löschen?')) {
                      setTherapies(therapies.filter(t => t.id !== therapy.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-700 transition p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(showAdd || editing) && (
        <TherapyModal
          therapy={editing}
          onSave={async (data) => {
            if (editing) {
              const updated = therapies.map(t => t.id === editing.id ? { ...t, ...data } : t);
              await setTherapies(updated);
              setEditing(null);
            } else {
              const newTherapy = { id: Date.now(), ...data };
              const updated = [...therapies, newTherapy];
              await setTherapies(updated);
              setShowAdd(false);
            }
          }}
          onClose={() => {
            setShowAdd(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function TherapyModal({ therapy, onSave, onClose }) {
  const [gkvPrice, setGkvPrice] = useState(therapy ? therapy.bonuses.GZV : 0);
  const [formData, setFormData] = useState(therapy || {
    name: '',
    time: 20,
    category: 'main'
  });

  const calculatedPrices = useMemo(() => calculatePrices(gkvPrice), [gkvPrice]);

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      bonuses: calculatedPrices
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border-4 border-blue-200 max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {therapy ? 'Therapie bearbeiten' : 'Neue Therapie'}
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200 transition">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Name der Therapie</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition"
              required
              placeholder="z.B. Krankengymnastik"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Dauer (Minuten)</label>
            <input
              type="number"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: Number(e.target.value) })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition"
              required
              min="5"
              step="5"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Kategorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition"
            >
              <option value="main">⭐ Haupttherapie</option>
              <option value="secondary">🔧 Nebentherapie</option>
            </select>
          </div>
          
          <div className="border-t-2 border-gray-200 pt-5">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">GKV-Preis (€)</label>
              <input
                type="number"
                step="0.01"
                value={gkvPrice}
                onChange={(e) => setGkvPrice(Number(e.target.value))}
                className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition text-lg font-bold"
                required
                placeholder="0.00"
              />
            </div>
            
            <div className="mt-5 space-y-3">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">GKV</span>
                  <span className="text-xl font-bold text-blue-600">{calculatedPrices.GZV.toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-gray-900">Beihilfe</span>
                    <span className="text-xs text-gray-600 ml-2">(GKV × 1.4)</span>
                  </div>
                  <span className="text-xl font-bold text-green-600">{calculatedPrices.BH.toFixed(2)}€</span>
                </div>
              </div>
              
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm font-bold text-gray-900">Privat</span>
                    <span className="text-xs text-gray-600 ml-2">(GKV × 1.5)</span>
                  </div>
                  <span className="text-xl font-bold text-red-600">{calculatedPrices.P.toFixed(2)}€</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition"
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TherapistDashboard({ therapist, therapies, activities, setActivities, onLogout }) {
  const [activeView, setActiveView] = useState('tracker');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  const todayActivities = useMemo(() => {
    if (!activities[selectedDate]) return [];
    return activities[selectedDate][therapist.id] || [];
  }, [activities, selectedDate, therapist.id]);

  const addActivity = async (therapy, kasse) => {
    const newActivity = {
      id: Date.now() + Math.random(),
      therapyId: therapy.id,
      name: therapy.name,
      time: therapy.time,
      kasse: kasse,
      bonus: therapy.bonuses[kasse],
      timestamp: new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedActivities = { ...activities };
    if (!updatedActivities[selectedDate]) {
      updatedActivities[selectedDate] = {};
    }
    if (!updatedActivities[selectedDate][therapist.id]) {
      updatedActivities[selectedDate][therapist.id] = [];
    }
    
    updatedActivities[selectedDate][therapist.id] = [...updatedActivities[selectedDate][therapist.id], newActivity];
    await setActivities(updatedActivities);
    setSelectedTherapy(null);
    setShowAddActivity(false);
  };

  const removeActivity = async (activityId) => {
    const updatedActivities = { ...activities };
    if (updatedActivities[selectedDate] && updatedActivities[selectedDate][therapist.id]) {
      updatedActivities[selectedDate][therapist.id] = updatedActivities[selectedDate][therapist.id].filter(a => a.id !== activityId);
      await setActivities(updatedActivities);
    }
  };

  const dailyStats = useMemo(() => {
    const totalTime = todayActivities.reduce((sum, a) => sum + a.time, 0);
    const bonus = todayActivities.reduce((sum, a) => sum + a.bonus, 0);

    return {
      totalTime,
      hours: Math.floor(totalTime / 60),
      minutes: totalTime % 60,
      bonus: bonus.toFixed(2),
      count: todayActivities.length
    };
  }, [todayActivities]);

  const allTimeStats = useMemo(() => {
    const allActivities = Object.values(activities).flatMap(dateActivities =>
      (dateActivities[therapist.id] || [])
    );

    const totalBonus = allActivities.reduce((sum, a) => sum + a.bonus, 0);
    const totalTime = allActivities.reduce((sum, a) => sum + a.time, 0);

    return {
      totalBonus: totalBonus.toFixed(2),
      totalHours: Math.floor(totalTime / 60),
      totalActivities: allActivities.length
    };
  }, [activities, therapist.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo className="w-32 h-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hallo, {therapist.name}! 👋</h1>
                <p className="text-sm text-gray-600 font-semibold">Bonusanteil: {therapist.revenuePercent}%</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2.5 rounded-xl transition flex items-center gap-2 font-semibold shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveView('tracker')}
            className={`px-6 py-3 rounded-xl transition font-semibold ${
              activeView === 'tracker' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Aktivitäten
          </button>
          <button
            onClick={() => setActiveView('statistics')}
            className={`px-6 py-3 rounded-xl transition font-semibold ${
              activeView === 'statistics' 
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Statistiken
          </button>
        </div>

        {activeView === 'tracker' && (
          <TrackerView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            todayActivities={todayActivities}
            dailyStats={dailyStats}
            therapies={therapies}
            showAddActivity={showAddActivity}
            setShowAddActivity={setShowAddActivity}
            selectedTherapy={selectedTherapy}
            setSelectedTherapy={setSelectedTherapy}
            addActivity={addActivity}
            removeActivity={removeActivity}
          />
        )}

        {activeView === 'statistics' && (
          <StatisticsView
            therapist={therapist}
            allTimeStats={allTimeStats}
          />
        )}
      </div>
    </div>
  );
}

function TrackerView({ selectedDate, setSelectedDate, todayActivities, dailyStats, therapies, showAddActivity, setShowAddActivity, selectedTherapy, setSelectedTherapy, addActivity, removeActivity }) {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm text-gray-600 font-bold mb-2 uppercase">💰 Bonus heute</div>
          <div className="text-4xl font-bold text-gray-900">{dailyStats.bonus}€</div>
          <div className="text-sm text-gray-600 mt-1 font-medium">{dailyStats.count} Therapien</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm text-gray-600 font-bold mb-2 uppercase">⏱️ Arbeitszeit</div>
          <div className="text-4xl font-bold text-gray-900">{dailyStats.hours}:{dailyStats.minutes.toString().padStart(2, '0')}</div>
          <div className="text-sm text-gray-600 mt-1 font-medium">Stunden</div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
          <div className="text-sm text-gray-600 font-bold mb-2 uppercase">📅 Datum</div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-gray-50 border-2 border-gray-300 rounded-xl px-4 py-2 text-gray-900 font-bold focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Aktivitäten am {new Date(selectedDate + 'T00:00:00').toLocaleDateString('de-DE')}</h3>
          <button
            onClick={() => setShowAddActivity(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-semibold shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            Hinzufügen
          </button>
        </div>

        <div className="space-y-3">
          {todayActivities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-semibold">Noch keine Therapien erfasst</p>
              <p className="text-sm mt-2">Klicken Sie auf "Hinzufügen" um zu starten</p>
            </div>
          ) : (
            todayActivities.map((activity) => (
              <div
                key={activity.id}
                className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 flex items-center justify-between border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-2 h-14 rounded-full ${
                    activity.kasse === 'GZV' ? 'bg-blue-500' : activity.kasse === 'BH' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-600 mt-1 font-medium">
                      {activity.kasse === 'GZV' ? 'GKV' : activity.kasse === 'BH' ? 'Beihilfe' : 'Privat'} • {activity.time} Min • {activity.timestamp}
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-2xl font-bold text-green-600">
                      {activity.bonus.toFixed(2)}€
                    </div>
                    <div className="text-xs text-gray-600 font-semibold uppercase">Bonus</div>
                  </div>
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="text-red-600 hover:text-red-700 transition p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddActivity && !selectedTherapy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl border-4 border-blue-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Therapie wählen</h2>
                <button
                  onClick={() => setShowAddActivity(false)}
                  className="text-white hover:text-gray-200 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-6 space-y-3" style={{ maxHeight: 'calc(90vh - 100px)' }}>
              {therapies.map((therapy) => (
                <button
                  key={therapy.id}
                  onClick={() => setSelectedTherapy(therapy)}
                  className="w-full bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-100 rounded-xl p-5 transition flex items-center justify-between text-left border border-gray-200 hover:border-blue-300 hover:shadow-md"
                >
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900 mb-2">{therapy.name}</div>
                    <div className="text-sm text-gray-600 font-medium">
                      ⏱️ {therapy.time} Min • {therapy.category === 'main' ? '⭐ Haupttherapie' : '🔧 Nebentherapie'}
                    </div>
                  </div>
                  <div className="text-blue-600 font-bold">
                    <span className="text-sm">Kasse wählen →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showAddActivity && selectedTherapy && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border-4 border-blue-200">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <button
                onClick={() => setSelectedTherapy(null)}
                className="flex items-center gap-2 text-white hover:text-gray-200 mb-4 transition font-semibold"
              >
                ← Zurück
              </button>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedTherapy.name}</h2>
              <p className="text-white/90 text-sm font-medium">⏱️ {selectedTherapy.time} Minuten</p>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Kassenart wählen:</h3>
              
              {['GZV', 'BH', 'P'].map((kasse) => {
                const labels = { GZV: 'GKV', BH: 'Beihilfe', P: 'Privat' };
                const bonus = selectedTherapy.bonuses[kasse];

                return (
                  <button
                    key={kasse}
                    onClick={() => addActivity(selectedTherapy, kasse)}
                    className={`w-full rounded-2xl p-6 transition border-2 hover:shadow-lg text-left ${
                      kasse === 'GZV' 
                        ? 'bg-blue-50 border-blue-300 hover:bg-blue-100' 
                        : kasse === 'BH' 
                        ? 'bg-green-50 border-green-300 hover:bg-green-100' 
                        : 'bg-red-50 border-red-300 hover:bg-red-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full ${
                          kasse === 'GZV' ? 'bg-blue-500' : kasse === 'BH' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <div className="text-xl font-bold text-gray-900 mb-1">{labels[kasse]}</div>
                          <div className="text-sm text-gray-600 font-medium">
                            Dein Bonus: {bonus.toFixed(2)}€
                          </div>
                        </div>
                      </div>
                      <div className={`text-3xl font-bold ${
                        kasse === 'GZV' ? 'text-blue-600' : kasse === 'BH' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        +{bonus.toFixed(2)}€
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatisticsView({ therapist, allTimeStats }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Gesamtstatistik</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-sm text-gray-600 font-bold mb-3 uppercase">💰 Gesamtbonus</div>
            <div className="text-5xl font-bold text-green-600 mb-2">{allTimeStats.totalBonus}€</div>
            <div className="text-sm text-gray-600 font-medium">Berechnet aus allen Aktivitäten</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 font-bold mb-3 uppercase">⏱️ Gesamtarbeitszeit</div>
            <div className="text-5xl font-bold text-blue-600 mb-2">{allTimeStats.totalHours}h</div>
            <div className="text-sm text-gray-600 font-medium">Geleistete Stunden</div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-600 font-bold mb-3 uppercase">📊 Therapien gesamt</div>
            <div className="text-5xl font-bold text-purple-600 mb-2">{allTimeStats.totalActivities}</div>
            <div className="text-sm text-gray-600 font-medium">Durchgeführte Behandlungen</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Deine Einstellungen</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-semibold">Bonusanteil:</span>
            <span className="text-2xl font-bold text-gray-900">{therapist.revenuePercent}%</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-700 font-semibold">Bonusziel:</span>
            <span className="text-2xl font-bold text-gray-900">{therapist.bonusTarget}€</span>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-700 font-bold uppercase">Fortschritt zum Ziel</span>
              <span className="text-sm text-gray-900 font-bold">
                {((parseFloat(allTimeStats.totalBonus) / therapist.bonusTarget) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
              <div 
                className="bg-gradient-to-r from-blue-600 to-blue-700 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                style={{ width: `${Math.min((parseFloat(allTimeStats.totalBonus) / therapist.bonusTarget) * 100, 100)}%` }}
              >
                {((parseFloat(allTimeStats.totalBonus) / therapist.bonusTarget) * 100) > 10 && (
                  <span className="text-xs text-white font-bold">
                    {((parseFloat(allTimeStats.totalBonus) / therapist.bonusTarget) * 100).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600 font-medium">
              <span>0€</span>
              <span>{therapist.bonusTarget}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}