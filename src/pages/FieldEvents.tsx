import { CheckSquare, Plus, Trash, AlertCircle, ArrowRight, Target, Edit3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FieldEvents() {
  const navigate = useNavigate();
  const enteredCompetitionId = sessionStorage.getItem('enteredCompetitionId');
  const enteredCompetitionName = sessionStorage.getItem('enteredCompetitionName');

  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(() => {
    const stored = sessionStorage.getItem('selectedEventId');
    return stored ? parseInt(stored) : null;
  });
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [displayAttempts, setDisplayAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [confirmDeleteEventId, setConfirmDeleteEventId] = useState<number | null>(null);
  const [confirmDeleteResultId, setConfirmDeleteResultId] = useState<number | null>(null);
  const [confirmResetEvent, setConfirmResetEvent] = useState(false);

  // Modals
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  
  const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
  const [newParticipant, setNewParticipant] = useState({
    athlete_name: "",
    island: "",
    lane_or_order: 1
  });

  const [showEnterMarkModal, setShowEnterMarkModal] = useState(false);
  const [editingResultId, setEditingResultId] = useState<number | null>(null);
  const [editingResult, setEditingResult] = useState({
    athlete_name: "",
    island: "KAVARATTI",
    position: 1,
    mark: "",
    a1: "",
    a2: "",
    a3: "",
    is_pb: false,
    lane_or_order: 1,
    new_record: ""
  });

  const islandsList = [
    "AGATTI", "AMINI", "ANDROTH", "BITRA", "CHETLAT",
    "KADMAT", "KALPENI", "KAVARATTI", "KILTAN", "MINICOY"
  ];

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api';

  const getNumericValue = (val: string) => {
    if (!val || val === "-" || val === "X") return 0;
    const parsed = parseFloat(val.replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateBestOfTrials = (a1: string, a2: string, a3: string) => {
    const v1 = getNumericValue(a1);
    const v2 = getNumericValue(a2);
    const v3 = getNumericValue(a3);

    let maxVal = 0;
    let bestStr = "-";

    if (v1 > maxVal) { maxVal = v1; bestStr = a1; }
    if (v2 > maxVal) { maxVal = v2; bestStr = a2; }
    if (v3 > maxVal) { maxVal = v3; bestStr = a3; }

    if (bestStr === "-") {
      if (a1 === "X" || a2 === "X" || a3 === "X") {
        bestStr = "X";
      }
    }
    return bestStr;
  };

  const getBestOfFirstTwo = (a1: string, a2: string) => {
    const v1 = getNumericValue(a1);
    const v2 = getNumericValue(a2);
    let bestVal = 0;
    let bestStr = "-";
    if (v1 > bestVal) { bestVal = v1; bestStr = a1; }
    if (v2 > bestVal) { bestVal = v2; bestStr = a2; }
    if (bestStr === "-" && (a1 === "X" || a2 === "X")) {
      bestStr = "X";
    }
    return { bestVal, bestStr };
  };

  const getPositionRank = (resultId: number) => {
    const withMarks = displayAttempts.filter(r => r.best !== "-");
    const sortedDesc = [...withMarks].sort((a, b) => getNumericValue(b.best) - getNumericValue(a.best));
    const idx = sortedDesc.findIndex(r => r.id === resultId);
    return idx === -1 ? displayAttempts.length : idx + 1;
  };

  useEffect(() => {
    if (selectedEventId) {
      sessionStorage.setItem('selectedEventId', selectedEventId.toString());
    } else {
      sessionStorage.removeItem('selectedEventId');
    }
  }, [selectedEventId]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchEvents = () => {
    if (!enteredCompetitionId) return;
    setEventsLoading(true);
    fetch(`${API_URL}/events/?competition_id=${enteredCompetitionId}&event_type=FIELD`)
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setEventsLoading(false);
        if (data.length > 0) {
          const exists = data.some((e: any) => e.id === selectedEventId);
          if (!exists) {
            setSelectedEventId(data[0].id);
            setSelectedEvent(data[0]);
          } else {
            const found = data.find((e: any) => e.id === selectedEventId);
            setSelectedEvent(found);
          }
        } else {
          setSelectedEventId(null);
          setSelectedEvent(null);
          setDisplayAttempts([]);
        }
      })
      .catch(err => {
        console.error("Failed to fetch events:", err);
        setEventsLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [enteredCompetitionId]);

  const fetchResults = () => {
    if (!selectedEventId) return;
    setLoading(true);
    fetch(`${API_URL}/events/${selectedEventId}/results`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((d: any) => {
          let a1 = "-";
          let a2 = "-";
          let a3 = "-";
          let best = "-";
          if (d.mark) {
            const parts = d.mark.split(',');
            if (parts.length >= 2) {
              a1 = parts[0] || "-";
              a2 = parts[1] || "-";
              a3 = parts[2] || "-";
              best = calculateBestOfTrials(a1, a2, a3);
            } else {
              a1 = d.mark;
              a2 = "-";
              a3 = "-";
              best = d.mark;
            }
          }
          return {
            id: d.id, pos: d.position, name: d.athlete_name, island: d.island,
            best: best, pb: d.is_pb, a1: a1, a2: a2, a3: a3, order: d.lane_or_order,
            newRecord: d.new_record
          };
        });
        setDisplayAttempts(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResults();
  }, [selectedEventId]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim() || !enteredCompetitionId) return;

    try {
      const response = await fetch(`${API_URL}/events/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition_id: parseInt(enteredCompetitionId),
          name: newEventName.trim().toUpperCase(),
          event_type: 'FIELD',
          status: 'PENDING'
        })
      });

      if (!response.ok) {
        setToast("ERROR: FAILED TO CREATE EVENT");
        return;
      }

      const createdEvent = await response.json();

      setNewEventName("");
      setShowAddEventModal(false);
      
      if (createdEvent.event_type !== 'FIELD') {
        sessionStorage.setItem('selectedEventId', createdEvent.id.toString());
        setToast("EVENT DETECTED & SAVED AS TRACK EVENT. REDIRECTING...");
        setTimeout(() => {
          navigate('/dashboard/track-events');
        }, 1500);
      } else {
        setSelectedEventId(createdEvent.id);
        setToast("EVENT CREATED SUCCESSFULLY");
        fetchEvents();
      }
    } catch (err) {
      console.error(err);
      setToast("ERROR CREATING EVENT");
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        setToast("ERROR: FAILED TO DELETE EVENT");
        return;
      }

      setToast("EVENT DELETED");
      if (selectedEventId === eventId) {
        setSelectedEventId(null);
        setSelectedEvent(null);
      }
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !selectedEvent) return;

    try {
      // 1. Add as placeholder result
      const response = await fetch(`${API_URL}/events/${selectedEventId}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEventId,
          athlete_name: newParticipant.athlete_name.trim().toUpperCase(),
          island: newParticipant.island,
          position: 0,
          mark: "-,-,-",
          is_pb: false,
          lane_or_order: newParticipant.lane_or_order
        })
      });

      if (!response.ok) {
        setToast("ERROR: FAILED TO REGISTER PARTICIPANT");
        return;
      }

      // 2. Add to entry list for StartLists page sync
      const entryId = `ENT-${Math.floor(1000 + Math.random() * 9000)}`;
      await fetch(`${API_URL}/entries/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entry_id: entryId,
          athlete_name: newParticipant.athlete_name.trim().toUpperCase(),
          island: newParticipant.island,
          event_name: selectedEvent.name,
          age_group: "SENIOR",
          age_check: "PASS",
          dup_check: "PASS",
          clash_check: "PASS",
          status: "APPROVED"
        })
      }).catch(err => console.error("Entry synchronization failed:", err));

      // 3. Also register in global athlete roster (avoids separate registration)
      const athleteId = `ATH-${Math.floor(1000 + Math.random() * 9000)}`;
      await fetch(`${API_URL}/athletes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          athlete_id: athleteId,
          name: newParticipant.athlete_name.trim().toUpperCase(),
          event: selectedEvent.name,
          island: newParticipant.island,
          pb: "-",
          status: "ACTIVE"
        })
      }).catch(err => console.error("Global athlete registration failed:", err));

      setShowAddParticipantModal(false);
      setNewParticipant({
        athlete_name: "", island: "", lane_or_order: displayAttempts.length + 2
      });
      setToast("ATHLETE REGISTERED & ADDED TO EVENT");
      fetchEvents();
      fetchResults();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || !editingResultId) return;

    try {
      const markString = `${editingResult.a1 || "-"}-${editingResult.a2 || "-"}-${editingResult.a3 || "-"}`.replace(/-/g, ',');
      const response = await fetch(`${API_URL}/events/${selectedEventId}/results/${editingResultId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: selectedEventId,
          athlete_name: editingResult.athlete_name,
          island: editingResult.island,
          position: editingResult.position,
          mark: markString,
          is_pb: editingResult.is_pb,
          lane_or_order: editingResult.lane_or_order,
          new_record: editingResult.new_record.trim() || null
        })
      });

      if (!response.ok) {
        setToast("ERROR: FAILED TO UPDATE MARK");
        return;
      }

      setShowEnterMarkModal(false);
      setEditingResultId(null);
      setToast("ATHLETE PERFORMANCE RECORDED");
      fetchResults();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResult = async (resultId: number) => {
    if (!selectedEventId) return;

    try {
      const response = await fetch(`${API_URL}/events/${selectedEventId}/results/${resultId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        setToast("ERROR: FAILED TO REMOVE ATHLETE");
        return;
      }

      setToast("ATHLETE REMOVED");
      fetchResults();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearResults = async () => {
    if (!selectedEventId) return;

    try {
      const response = await fetch(`${API_URL}/events/${selectedEventId}/results`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        setToast("ERROR: FAILED TO CLEAR RESULTS");
        return;
      }

      setToast("EVENT RESET");
      setDisplayAttempts([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = () => {
    if (!selectedEventId) return;
    fetch(`${API_URL}/events/${selectedEventId}/approve`, { method: 'PUT' })
      .then(res => res.json())
      .then(updatedEvent => {
        setSelectedEvent(updatedEvent);
        setToast("RESULTS APPROVED");
        fetchEvents();
      })
      .catch(err => console.error(err));
  };

  const formatAttempt = (val: string) => {
    if (val === 'X') return <span className="text-track-coral font-black">X</span>;
    return <span className="font-bold">{val}</span>;
  };

  // Sort: Put finished results at the top sorted by position, and unfinished at the bottom by order
  const sortedAttempts = [...displayAttempts].sort((a, b) => {
    if (selectedEvent && selectedEvent.status === 'OFFICIAL') {
      if (a.pos !== b.pos) {
        if (a.pos === 0) return 1;
        if (b.pos === 0) return -1;
        return a.pos - b.pos;
      }
      return getNumericValue(b.best) - getNumericValue(a.best);
    }

    // Check if ALL athletes have completed Trial 1 and Trial 2
    const allCompletedFirstTwo = displayAttempts.length > 0 && displayAttempts.every(r => r.a1 !== "-" && r.a2 !== "-");

    if (allCompletedFirstTwo) {
      // Sort in ASCENDING order of the best of the first 2 trials (worst throws first, best throws last)
      const aBest2 = getBestOfFirstTwo(a.a1, a.a2).bestVal;
      const bBest2 = getBestOfFirstTwo(b.a1, b.a2).bestVal;
      if (aBest2 !== bBest2) {
        return aBest2 - bBest2;
      }
    }

    return a.order - b.order;
  });

  const currentLeader = sortedAttempts.find(r => r.pos === 1 && r.best !== "-");

  const getStatusBadge = (status: string, isSelected: boolean) => {
    switch (status) {
      case 'LIVE':
        return (
          <span className="flex items-center gap-1.5 text-[9px] font-black text-track-coral animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-track-coral animate-pulse"></span>
            LIVE
          </span>
        );
      case 'OFFICIAL':
        return (
          <span className={`flex items-center gap-1.5 text-[9px] font-black ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-emerald-600'}`}></span>
            OFFICIAL
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className={`flex items-center gap-1.5 text-[9px] font-black ${isSelected ? 'text-amber-300' : 'text-amber-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-amber-600'}`}></span>
            PENDING
          </span>
        );
    }
  };

  // If no competition has been entered
  if (!enteredCompetitionId) {
    return (
      <div className="py-20 px-4 max-w-2xl mx-auto text-center">
        <div className="brutal-card p-12 bg-white border-8 border-track-dark shadow-[12px_12px_0px_#00C8C8] flex flex-col items-center">
          <div className="w-24 h-24 bg-track-lagoon border-4 border-track-dark flex items-center justify-center transform -skew-x-12 mb-8 animate-bounce">
            <AlertCircle className="w-12 h-12 text-track-dark stroke-[3]" />
          </div>
          <h1 className="text-5xl editorial-heading-bebas text-track-dark leading-none mb-4">NO MEET ACTIVE</h1>
          <p className="font-black text-track-dark/60 uppercase tracking-wider text-sm mb-8 max-w-md">
            You must enter a competition/meet from the Competitions panel to view, create, or record event schedules.
          </p>
          <button 
            onClick={() => navigate('/dashboard/competitions')} 
            className="flex items-center gap-3 bg-track-coral text-white font-black text-xl uppercase px-8 py-4 border-4 border-track-dark shadow-[6px_6px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all transform -skew-x-6"
          >
            SELECT A MEET <ArrowRight className="w-6 h-6 stroke-[3]" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 pt-4 px-2 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 border-b-8 border-track-dark pb-6">
        <div>
          <span className="bg-track-lagoon text-track-dark font-black px-3 py-1 text-xs uppercase tracking-widest border-2 border-track-dark shadow-[2px_2px_0px_#010F1A]">
            ACTIVE MEET: {enteredCompetitionName}
          </span>
          <h1 className="text-6xl md:text-8xl editorial-heading-bebas text-track-dark leading-none mt-2">FIELD EVENTS</h1>
          <p className="text-lg font-black text-track-dark/60 uppercase tracking-widest border-l-4 border-track-coral pl-3 mt-1">
            {selectedEvent ? `${selectedEvent.name} • ${selectedEvent.status}` : "MANAGE MEET SCHEDULE & EVENT RESULTS"}
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddEventModal(true)} 
            className="flex items-center gap-2 bg-track-dark text-white px-5 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#FF7A45] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-black uppercase tracking-widest text-sm"
          >
            <Plus className="w-5 h-5 stroke-[3]" /> ADD EVENT
          </button>
          {selectedEvent && (
            <button 
              onClick={() => {
                setNewParticipant({
                  ...newParticipant,
                  lane_or_order: displayAttempts.length + 1
                });
                setShowAddParticipantModal(true);
              }} 
              disabled={selectedEvent.status === 'OFFICIAL'}
              className="flex items-center gap-2 bg-track-coral text-white px-5 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all font-black uppercase tracking-widest text-sm disabled:opacity-50"
            >
              <Plus className="w-5 h-5 stroke-[3]" /> ADD ATHLETE (PARTICIPANT)
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Events Sidebar List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="brutal-card p-4 bg-track-foam border-4 border-track-dark shadow-[4px_4px_0px_#010F1A]">
            <h3 className="font-black text-xl text-track-dark uppercase tracking-wide border-b-4 border-track-dark pb-2 mb-3">FIELD SCHEDULE</h3>
            
            {eventsLoading ? (
              <p className="text-sm font-bold text-track-dark/40 uppercase animate-pulse">LOADING SCHEDULE...</p>
            ) : events.length === 0 ? (
              <p className="text-sm font-bold text-track-dark/40 uppercase">NO EVENTS CREATED YET.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {events.map((evt) => (
                  <div 
                    key={evt.id} 
                    onClick={() => {
                      setSelectedEventId(evt.id);
                      setSelectedEvent(evt);
                    }}
                    className={`p-3 border-4 font-black uppercase text-xs cursor-pointer transition-all flex justify-between items-center group ${
                      selectedEventId === evt.id 
                        ? 'bg-track-dark text-white border-track-dark' 
                        : 'bg-white text-track-dark border-track-dark hover:bg-track-foam/40'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bebas text-lg leading-none tracking-wide">{evt.name}</span>
                      {getStatusBadge(evt.status, selectedEventId === evt.id)}
                    </div>
                    {confirmDeleteEventId === evt.id ? (
                      <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(evt.id);
                            setConfirmDeleteEventId(null);
                          }}
                          className="px-1.5 py-0.5 bg-track-coral text-white border-2 border-track-dark font-black text-[9px] uppercase shadow-[1px_1px_0px_#010F1A] cursor-pointer"
                        >
                          YES
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmDeleteEventId(null);
                          }}
                          className="px-1.5 py-0.5 bg-white text-track-dark border-2 border-track-dark font-black text-[9px] uppercase shadow-[1px_1px_0px_#010F1A] cursor-pointer"
                        >
                          NO
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteEventId(evt.id);
                        }} 
                        className="p-1.5 bg-white text-track-dark border-2 border-track-dark hover:bg-track-coral hover:text-white transition-colors ml-2 shrink-0 z-10 cursor-pointer"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {!selectedEvent ? (
            <div className="brutal-card p-12 text-center bg-white">
              <Target className="w-16 h-16 mx-auto text-track-dark/20 stroke-[2] mb-4" />
              <h2 className="text-2xl font-black text-track-dark/40 uppercase tracking-widest">SELECT OR ADD AN EVENT TO REGISTER ATHLETES</h2>
            </div>
          ) : (
            <>
              {/* Control panel */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border-4 border-track-dark p-4 shadow-[4px_4px_0px_#010F1A] gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 border-r-4 border-track-dark">
                    <Target className="w-5 h-5 text-track-dark stroke-[3]" />
                    <span className="font-black text-lg">{selectedEvent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedEvent.status === 'LIVE' ? (
                      <>
                        <span className="w-3 h-3 rounded-full bg-track-coral animate-pulse"></span>
                        <span className="font-black uppercase tracking-widest text-sm text-track-coral">LIVE</span>
                      </>
                    ) : selectedEvent.status === 'OFFICIAL' ? (
                      <>
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="font-black uppercase tracking-widest text-sm text-emerald-600">OFFICIAL</span>
                      </>
                    ) : (
                      <>
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="font-black uppercase tracking-widest text-sm text-amber-500">PENDING</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  {selectedEvent.status !== 'OFFICIAL' && (
                    <>
                      {confirmResetEvent ? (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              handleClearResults();
                              setConfirmResetEvent(false);
                            }}
                            className="bg-track-coral text-white px-4 py-2 border-4 border-track-dark font-black uppercase text-xs cursor-pointer"
                          >
                            CONFIRM RESET
                          </button>
                          <button 
                            onClick={() => setConfirmResetEvent(false)}
                            className="bg-white text-track-dark px-4 py-2 border-4 border-track-dark font-black uppercase text-xs cursor-pointer"
                          >
                            CANCEL
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setConfirmResetEvent(true)} 
                          disabled={displayAttempts.length === 0}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-track-dark px-4 py-2 border-4 border-track-dark hover:bg-track-coral hover:text-white transition-all font-black uppercase text-xs disabled:opacity-40 cursor-pointer"
                        >
                          RESET EVENT
                        </button>
                      )}
                      <button 
                        onClick={handleApprove} 
                        disabled={displayAttempts.length === 0 || displayAttempts.some(r => r.best === "-")}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FFD700] text-track-dark px-4 py-2 border-4 border-track-dark hover:translate-y-0.5 hover:shadow-none transition-all font-black uppercase text-xs disabled:opacity-45"
                        title={displayAttempts.some(r => r.best === "-") ? "Please enter results for all participating athletes first" : "Approve and publish results"}
                      >
                        <CheckSquare className="w-4 h-4 stroke-[3]" /> APPROVE RESULTS
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Current Leader Widget */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                <div className="lg:col-span-1 brutal-card p-6 bg-track-dark text-white flex flex-col justify-center items-center text-center">
                  <div className="w-20 h-20 bg-track-coral border-4 border-white flex items-center justify-center transform -skew-x-12 mb-6 shadow-[4px_4px_0px_#00C8C8]">
                    <Target className="w-10 h-10 text-white stroke-[3]" />
                  </div>
                  <h3 className="text-sm font-black text-white/50 uppercase tracking-widest mb-2">CURRENT LEADER</h3>
                  <p className="text-4xl editorial-heading-bebas mb-2 uppercase truncate max-w-[150px]">{currentLeader?.name?.split(' ')[0] || "TBA"}</p>
                  <div className="text-5xl font-black text-track-lagoon">{currentLeader?.best || "-"}</div>
                </div>

                <div className="lg:col-span-3 brutal-card p-6 bg-white relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute -right-10 -bottom-10 opacity-5 text-track-dark pointer-events-none">
                    <AlertCircle className="w-64 h-64" />
                  </div>
                  <div className="flex justify-between items-center mb-6 border-b-4 border-track-dark pb-4 relative z-10">
                     <h3 className="text-3xl editorial-heading-bebas text-track-dark">LATEST ATTEMPT</h3>
                     <span className="bg-track-coral text-white font-black px-3 py-1 text-sm uppercase transform -skew-x-12 shadow-[2px_2px_0px_#010F1A]">
                       {selectedEvent.status === 'OFFICIAL' ? 'OFFICIAL' : selectedEvent.status === 'LIVE' ? 'LIVE' : 'PENDING'}
                     </span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                     <div className="w-24 h-24 bg-track-foam border-4 border-track-dark rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                       <div className="w-full h-full bg-track-dark text-white flex items-center justify-center font-bebas text-5xl">
                         {sortedAttempts[0]?.name?.charAt(0) || "?"}
                       </div>
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <p className="text-xl font-black text-track-dark uppercase mb-1">{sortedAttempts[0]?.name || "NO ATHLETES REGISTERED"}</p>
                        <p className="text-sm font-bold text-track-dark/60 uppercase mb-4">{sortedAttempts[0]?.island || "SELECT 'ADD ATHLETE' TO START BUILD LIST"}</p>
                        <div className="flex justify-center md:justify-start items-end gap-4">
                           <div className="text-6xl font-black text-track-dark leading-none">{sortedAttempts[0]?.best || "-"}</div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="brutal-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-center border-collapse">
                    <thead>
                      <tr className="bg-track-dark text-white text-xs uppercase tracking-widest font-black border-b-8 border-track-dark">
                        <th className="p-4 border-r-4 border-track-dark/20 w-16">POS</th>
                        <th className="p-4 border-r-4 border-track-dark/20 text-left">ATHLETE</th>
                        <th className="p-4 border-r-4 border-track-dark/20">ORDER</th>
                        <th className="p-4 border-r-4 border-track-dark/20">TRIAL 1</th>
                        <th className="p-4 border-r-4 border-track-dark/20">TRIAL 2</th>
                        <th className="p-4 border-r-4 border-track-dark/20">TRIAL 3</th>
                        <th className="p-4 text-right bg-track-lagoon text-track-dark">BEST</th>
                        {selectedEvent.status !== 'OFFICIAL' && (
                          <th className="p-4 text-center w-36 bg-track-foam text-track-dark border-l-4 border-track-dark">ACTIONS</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={selectedEvent.status !== 'OFFICIAL' ? 8 : 7} className="p-8 text-center font-bold text-track-dark/40 uppercase">Loading Results...</td>
                        </tr>
                      ) : sortedAttempts.length === 0 ? (
                        <tr>
                          <td colSpan={selectedEvent.status !== 'OFFICIAL' ? 8 : 7} className="p-8 text-center font-bold text-track-dark/40 uppercase">No Athletes Registered. Click "ADD ATHLETE" to build the start list.</td>
                        </tr>
                      ) : sortedAttempts.map((result, i) => (
                        <tr key={i} className={`border-b-4 border-track-dark/10 hover:bg-track-foam transition-colors ${result.best === "-" ? 'bg-white/60' : result.pos === 1 ? 'bg-white' : 'bg-track-foam/50'}`}>
                          <td className="p-4 border-r-4 border-track-dark/10 font-black text-2xl text-track-dark">{result.pos === 0 ? "-" : result.pos}</td>
                          <td className="p-4 border-r-4 border-track-dark/10 text-left">
                            <div className="font-black text-track-dark text-lg uppercase">{result.name}</div>
                            <div className="text-xs font-black text-track-dark/60 uppercase">{result.island}</div>
                          </td>
                          <td className="p-4 border-r-4 border-track-dark/10 font-black text-track-dark/60">{result.order}</td>
                          <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a1)}</td>
                          <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a2)}</td>
                          <td className="p-4 border-r-4 border-track-dark/10 text-lg">{formatAttempt(result.a3)}</td>
                          <td className="p-4 text-right bg-track-lagoon/10">
                            <div className="flex items-center justify-end gap-3">
                              <span className="font-black text-2xl text-track-dark">
                                {result.best === "-" ? (
                                  <span className="text-track-coral font-bold uppercase tracking-widest text-xs">PENDING</span>
                                ) : (
                                  result.best
                                )}
                              </span>
                              {result.pb && result.best !== "-" && (
                                <span className="bg-track-coral text-white text-xs font-black px-2 py-1 transform -skew-x-6 shadow-[2px_2px_0px_#010F1A]">PB</span>
                              )}
                              {result.newRecord && result.best !== "-" && (
                                <span className="bg-[#FFD700] text-track-dark text-xs font-black px-2 py-0.5 border-2 border-track-dark">
                                  {result.newRecord}
                                </span>
                              )}
                            </div>
                          </td>
                          {selectedEvent.status !== 'OFFICIAL' && (
                            <td className="p-4 text-center border-l-4 border-track-dark">
                              <div className="flex justify-center gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingResultId(result.id);
                                    setEditingResult({
                                      athlete_name: result.name,
                                      island: result.island,
                                      position: result.pos === 0 ? getPositionRank(result.id) : result.pos,
                                      mark: result.best === "-" ? "" : result.best,
                                      a1: result.a1 === "-" ? "" : result.a1,
                                      a2: result.a2 === "-" ? "" : result.a2,
                                      a3: result.a3 === "-" ? "" : result.a3,
                                      is_pb: result.pb,
                                      lane_or_order: result.order,
                                      new_record: result.newRecord || ""
                                    });
                                    setShowEnterMarkModal(true);
                                  }}
                                  className="px-3 py-1 bg-track-lagoon text-track-dark border-2 border-track-dark font-black text-[10px] uppercase shadow-[2px_2px_0px_#010F1A] hover:shadow-none hover:translate-y-0.5 transition-all flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> ENTER MARK
                                </button>
                                {confirmDeleteResultId === result.id ? (
                                  <div className="flex gap-1 items-center">
                                    <button 
                                      onClick={() => {
                                        handleDeleteResult(result.id);
                                        setConfirmDeleteResultId(null);
                                      }}
                                      className="px-2 py-0.5 bg-track-coral text-white border-2 border-track-dark font-black text-[9px] uppercase cursor-pointer"
                                    >
                                      CONFIRM
                                    </button>
                                    <button 
                                      onClick={() => setConfirmDeleteResultId(null)}
                                      className="px-2 py-0.5 bg-white text-track-dark border-2 border-track-dark font-black text-[9px] uppercase cursor-pointer"
                                    >
                                      CANCEL
                                    </button>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setConfirmDeleteResultId(result.id)}
                                    className="p-1 bg-white border-2 border-track-dark text-track-dark hover:bg-track-coral hover:text-white transition-colors cursor-pointer"
                                    title="Remove Participant"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-track-foam border-4 border-track-dark font-black text-track-dark animate-pulse shadow-[6px_6px_0px_#010F1A]">
          {toast}
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-track-dark/85 backdrop-blur-xs">
          <div className="bg-white border-8 border-track-dark shadow-[12px_12px_0px_#FF7A45] w-full max-w-lg">
            <div className="p-4 border-b-8 border-track-dark bg-track-foam flex justify-between items-center">
              <h2 className="text-3xl editorial-heading-bebas text-track-dark">ADD EVENT</h2>
              <button onClick={() => setShowAddEventModal(false)} className="font-black text-track-dark text-xl hover:text-track-coral cursor-pointer">X</button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-2">Event Name / Round</label>
                <input 
                  required 
                  value={newEventName} 
                  onChange={e => setNewEventName(e.target.value)} 
                  className="w-full bg-track-foam border-4 border-track-dark p-3 font-bold uppercase" 
                  placeholder="ENTER EVENT NAME (E.G. JAVELIN THROW)" 
                />
              </div>
              <div className="flex justify-end pt-4 border-t-4 border-track-dark">
                <button type="submit" className="bg-track-coral text-white font-black text-md uppercase px-6 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-0.5 hover:shadow-none transition-all">
                  CREATE EVENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Participant Modal */}
      {showAddParticipantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-track-dark/85 backdrop-blur-xs">
          <div className="bg-white border-8 border-track-dark shadow-[12px_12px_0px_#00C8C8] w-full max-w-lg">
            <div className="p-4 border-b-8 border-track-dark bg-track-foam flex justify-between items-center">
              <h2 className="text-3xl editorial-heading-bebas text-track-dark">ADD EVENT PARTICIPANT</h2>
              <button onClick={() => setShowAddParticipantModal(false)} className="font-black text-track-dark text-xl hover:text-track-coral cursor-pointer">X</button>
            </div>
            <form onSubmit={handleCreateParticipant} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Athlete Full Name</label>
                <input 
                  required 
                  value={newParticipant.athlete_name} 
                  onChange={e => setNewParticipant({...newParticipant, athlete_name: e.target.value})} 
                  className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase" 
                  placeholder="ENTER ATHLETE FULL NAME" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Island Team</label>
                <select 
                  required
                  value={newParticipant.island} 
                  onChange={e => setNewParticipant({...newParticipant, island: e.target.value})} 
                  className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase appearance-none cursor-pointer"
                >
                  <option value="" disabled>SELECT</option>
                  {islandsList.map(isl => (
                    <option key={isl} value={isl}>{isl}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Order</label>
                <input 
                  type="number" 
                  required 
                  value={newParticipant.lane_or_order} 
                  onChange={e => setNewParticipant({...newParticipant, lane_or_order: parseInt(e.target.value) || 1})} 
                  className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold" 
                />
              </div>

              <div className="flex justify-end pt-4 border-t-4 border-track-dark">
                <button type="submit" className="bg-track-coral text-white font-black text-md uppercase px-6 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-0.5 hover:shadow-none transition-all">
                  ADD ATHLETE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Result (Mark) Modal */}
      {showEnterMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-track-dark/85 backdrop-blur-xs">
          <div className="bg-white border-8 border-track-dark shadow-[12px_12px_0px_#FF7A45] w-full max-w-lg">
            <div className="p-4 border-b-8 border-track-dark bg-track-foam flex justify-between items-center">
              <h2 className="text-3xl editorial-heading-bebas text-track-dark">ENTER PERFORMANCE MARK</h2>
              <button onClick={() => setShowEnterMarkModal(false)} className="font-black text-track-dark text-xl hover:text-track-coral cursor-pointer">X</button>
            </div>
            <form onSubmit={handleUpdateResult} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Athlete Name</label>
                  <input 
                    type="text" 
                    readOnly 
                    disabled
                    value={editingResult.athlete_name} 
                    className="w-full bg-track-foam/60 border-4 border-track-dark p-2 font-bold uppercase opacity-75 cursor-not-allowed" 
                  />
                </div>

                <div className="col-span-2 grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Trial 1</label>
                    <input 
                      required 
                      autoFocus
                      value={editingResult.a1} 
                      onChange={e => {
                        const val = e.target.value;
                        const hasVal = !!val && val !== "-";
                        const a2 = hasVal ? editingResult.a2 : "-";
                        const a3 = hasVal && a2 !== "-" ? editingResult.a3 : "-";
                        const best = calculateBestOfTrials(val, a2, a3);
                        setEditingResult({...editingResult, a1: val, a2, a3, mark: best});
                      }} 
                      className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase" 
                      placeholder="MARK (E.G. 15.20)" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Trial 2</label>
                    <input 
                      disabled={!editingResult.a1 || editingResult.a1 === "-"}
                      value={editingResult.a2} 
                      onChange={e => {
                        const val = e.target.value;
                        const hasVal = !!val && val !== "-";
                        const a3 = hasVal ? editingResult.a3 : "-";
                        const best = calculateBestOfTrials(editingResult.a1, val, a3);
                        setEditingResult({...editingResult, a2: val, a3, mark: best});
                      }} 
                      className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed" 
                      placeholder="FOUL (E.G. X)" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Trial 3</label>
                    <input 
                      disabled={!editingResult.a2 || editingResult.a2 === "-"}
                      value={editingResult.a3} 
                      onChange={e => {
                        const val = e.target.value;
                        const best = calculateBestOfTrials(editingResult.a1, editingResult.a2, val);
                        setEditingResult({...editingResult, a3: val, mark: best});
                      }} 
                      className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase disabled:opacity-50 disabled:cursor-not-allowed" 
                      placeholder="PASS (E.G. -)" 
                    />
                  </div>
                </div>

                <div className="col-span-2 flex justify-between items-center bg-track-foam p-3 border-4 border-track-dark">
                  <span className="text-xs font-black uppercase tracking-widest text-track-dark">Analyzed Best Mark:</span>
                  <span className="text-2xl font-black text-track-coral">{editingResult.mark || "-"}</span>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Final Position</label>
                  <input 
                    type="number" 
                    required 
                    value={editingResult.position} 
                    onChange={e => setEditingResult({...editingResult, position: parseInt(e.target.value) || 1})} 
                    className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold" 
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-track-dark mb-1">Record Type (Optional)</label>
                  <select 
                    value={editingResult.new_record} 
                    onChange={e => setEditingResult({...editingResult, new_record: e.target.value})} 
                    className="w-full bg-track-foam border-4 border-track-dark p-2 font-bold uppercase appearance-none"
                  >
                    <option value="">NONE</option>
                    <option value="MEET RECORD">MEET RECORD</option>
                    <option value="NATIONAL RECORD">NATIONAL RECORD</option>
                    <option value="STADIUM RECORD">STADIUM RECORD</option>
                  </select>
                </div>

                <div className="col-span-2 flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="is_pb_cb_f" 
                    checked={editingResult.is_pb} 
                    onChange={e => setEditingResult({...editingResult, is_pb: e.target.checked})} 
                    className="w-5 h-5 accent-track-coral border-4 border-track-dark" 
                  />
                  <label htmlFor="is_pb_cb_f" className="text-xs font-black uppercase tracking-widest text-track-dark select-none">
                    Is Personal Best (PB)?
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t-4 border-track-dark">
                <button type="submit" className="bg-track-coral text-white font-black text-md uppercase px-6 py-3 border-4 border-track-dark shadow-[4px_4px_0px_#010F1A] hover:translate-y-0.5 hover:shadow-none transition-all">
                  SAVE RESULT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
