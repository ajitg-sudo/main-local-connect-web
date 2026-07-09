import { useEffect, useState } from "react";
import FormField from "./FormField";
import {
  WEEKDAYS,
  defaultSchedule,
  scheduleToString,
  stringToSchedule,
  HOURS_PRESETS
} from "../../utils/businessHours";

export default function BusinessHoursPicker({ value, onChange, required }) {
  const [schedule, setSchedule] = useState(() => stringToSchedule(value) || defaultSchedule());
  const [unparsed, setUnparsed] = useState("");

  useEffect(() => {
    const parsed = stringToSchedule(value);
    if (parsed) {
      setSchedule(parsed);
      setUnparsed("");
    } else if (value?.trim()) {
      setUnparsed(value);
    } else {
      setSchedule(defaultSchedule());
      setUnparsed("");
    }
  }, [value]);

  const emit = (next) => {
    setSchedule(next);
    onChange(scheduleToString(next));
  };

  const toggleDay = (key) => {
    emit({
      ...schedule,
      days: { ...schedule.days, [key]: !schedule.days[key] }
    });
  };

  const applyPreset = (preset) => {
    emit({ ...schedule, days: { ...preset } });
  };

  const hasDays = WEEKDAYS.some((d) => schedule.days[d.key]);
  const preview = hasDays ? scheduleToString(schedule) : "Select at least one open day";

  return (
    <FormField
      label="Business hours"
      required={required}
      hint="Choose open days and set opening & closing time"
    >
      <div className="hours-picker">
        <div className="hours-picker-presets">
          <button type="button" className="hours-preset-btn" onClick={() => applyPreset(HOURS_PRESETS.weekdays)}>
            Mon–Fri
          </button>
          <button type="button" className="hours-preset-btn" onClick={() => applyPreset(HOURS_PRESETS.monSat)}>
            Mon–Sat
          </button>
          <button type="button" className="hours-preset-btn" onClick={() => applyPreset(HOURS_PRESETS.all)}>
            All week
          </button>
        </div>

        <p className="text-label mb-2">Open on</p>
        <div className="hours-day-grid">
          {WEEKDAYS.map((day) => {
            const active = schedule.days[day.key];
            return (
              <button
                key={day.key}
                type="button"
                className={`hours-day-chip ${active ? "hours-day-chip-active" : ""}`}
                onClick={() => toggleDay(day.key)}
                aria-pressed={active}
                title={day.full}
              >
                {day.label}
              </button>
            );
          })}
        </div>

        <div className="hours-time-row">
          <label className="hours-time-field">
            <span className="text-label">Opens</span>
            <input
              type="time"
              className="input-field"
              value={schedule.openTime}
              onChange={(e) => emit({ ...schedule, openTime: e.target.value })}
              required={required}
            />
          </label>
          <label className="hours-time-field">
            <span className="text-label">Closes</span>
            <input
              type="time"
              className="input-field"
              value={schedule.closeTime}
              onChange={(e) => emit({ ...schedule, closeTime: e.target.value })}
              required={required}
            />
          </label>
        </div>

        <div className={`hours-preview ${hasDays ? "" : "hours-preview-empty"}`}>
          <span className="text-caption font-semibold uppercase tracking-wide text-muted">Preview</span>
          <p className="text-body mt-1 font-bold text-ink">{preview}</p>
          {unparsed && unparsed !== preview && (
            <p className="text-caption mt-1 text-muted">Previous: {unparsed}</p>
          )}
        </div>
      </div>
    </FormField>
  );
}
