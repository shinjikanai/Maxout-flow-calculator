"use client";

import { useEffect, useMemo, useState } from "react";
import {
  calculate,
  buildTimeline,
  timelineHorizon,
  perUserRateFromBehavior,
  Metric,
  TimeBasis,
  CalcInput,
} from "@/lib/calc";
import { getDict, Lang, LANGS } from "@/lib/i18n";
import TimelineChart from "@/components/TimelineChart";

const LOCALE: Record<Lang, string> = { en: "en-US", ja: "ja-JP", ko: "ko-KR" };

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");

  // Inputs (stored as strings for smooth editing)
  const [metric, setMetric] = useState<Metric>("tps");
  const [capacityValue, setCapacityValue] = useState("100000");
  const [timeBasis, setTimeBasis] = useState<TimeBasis>("min");
  const [perUserMode, setPerUserMode] = useState<"direct" | "behavior">("direct");
  const [perUserRate, setPerUserRate] = useState("1");
  const [actionsPerClick, setActionsPerClick] = useState("1");
  const [thinkTime, setThinkTime] = useState("5");
  const [stayMinutes, setStayMinutes] = useState("10");
  const [utilizationPct, setUtilizationPct] = useState("80");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("qi-lang") : null;
    if (saved === "en" || saved === "ja" || saved === "ko") setLang(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("qi-lang", lang);
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const d = getDict(lang);
  const num = (s: string) => {
    const n = parseFloat(s);
    return isFinite(n) ? n : NaN;
  };

  const nf = useMemo(() => new Intl.NumberFormat(LOCALE[lang]), [lang]);
  const nf1 = useMemo(
    () => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 2 }),
    [lang]
  );
  const fmt = (n: number) => (isFinite(n) ? nf.format(Math.round(n)) : "—");
  const fmt1 = (n: number) => (isFinite(n) ? nf1.format(n) : "—");

  // Effective per-user rate (from direct entry or behavior estimate)
  const isThroughput = metric !== "concurrent";
  const effectiveBasis: TimeBasis = metric === "pageviews" ? timeBasis : "sec";
  const effPerUserRate =
    perUserMode === "direct"
      ? num(perUserRate)
      : perUserRateFromBehavior(num(actionsPerClick), num(thinkTime), effectiveBasis);

  const input: CalcInput = {
    metric,
    capacityValue: num(capacityValue),
    timeBasis: effectiveBasis,
    perUserRate: effPerUserRate,
    stayMinutes: num(stayMinutes),
    utilization: num(utilizationPct) / 100,
  };

  const r = calculate(input);

  const horizon = r.valid ? timelineHorizon(input.stayMinutes) : 12;
  const points = r.valid ? buildTimeline(r.recommendedOutflow, input.stayMinutes, horizon) : [];
  const tableRows = points.slice(0, Math.min(points.length, r.transitionMinute + 4));

  const throughputUnit =
    metric === "tps"
      ? "TPS"
      : metric === "rps"
      ? "RPS"
      : metric === "pageviews"
      ? d.form.metric.pageviews
      : "";

  const resetExample = () => {
    setMetric("tps");
    setCapacityValue("100000");
    setTimeBasis("min");
    setPerUserMode("direct");
    setPerUserRate("1");
    setActionsPerClick("1");
    setThinkTime("5");
    setStayMinutes("10");
    setUtilizationPct("80");
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="dot" aria-hidden="true">
              Q
            </span>
            <h1>{d.meta.title}</h1>
          </div>
          <div className="langsel" role="group" aria-label={d.nav.langLabel}>
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={lang === l.code ? "active" : ""}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="wrap">
        <p className="lead">{d.meta.subtitle}</p>

        {/* Intro */}
        <section className="card">
        <h2>{d.intro.heading}</h2>
        <p style={{ margin: 0, color: "var(--muted)" }}>{d.intro.body}</p>
        <div className="formula">
          {d.intro.formula}
          <span className="cap">{d.intro.formulaCaption}</span>
        </div>
      </section>

      <div className="grid2">
        {/* Form */}
        <section className="card">
          <h2>{d.form.heading}</h2>

          <div className="field">
            <span className="lab">{d.form.startFrom}</span>
            <div className="seg subtle">
              {(["concurrent", "tps", "rps", "pageviews"] as Metric[]).map((m) => (
                <button
                  key={m}
                  className={metric === m ? "active" : ""}
                  onClick={() => setMetric(m)}
                >
                  {d.form.metric[m]}
                </button>
              ))}
            </div>
            <span className="hint">{d.form.metricHint[metric]}</span>
          </div>

          <label className="field">
            <span className="lab">{d.form.capacityLabel[metric]}</span>
            <input
              type="number"
              min="0"
              value={capacityValue}
              onChange={(e) => setCapacityValue(e.target.value)}
            />
          </label>

          {metric === "pageviews" && (
            <div className="field">
              <span className="lab">{d.form.timeBasis}</span>
              <div className="seg subtle">
                <button
                  className={timeBasis === "sec" ? "active" : ""}
                  onClick={() => setTimeBasis("sec")}
                >
                  {d.form.perSec}
                </button>
                <button
                  className={timeBasis === "min" ? "active" : ""}
                  onClick={() => setTimeBasis("min")}
                >
                  {d.form.perMin}
                </button>
              </div>
            </div>
          )}

          {isThroughput && (
            <div className="field">
              <span className="lab">{d.form.perUserMode}</span>
              <div className="seg">
                <button
                  className={perUserMode === "direct" ? "active" : ""}
                  onClick={() => setPerUserMode("direct")}
                >
                  {d.form.perUserDirect}
                </button>
                <button
                  className={perUserMode === "behavior" ? "active" : ""}
                  onClick={() => setPerUserMode("behavior")}
                >
                  {d.form.perUserBehavior}
                </button>
              </div>

              {perUserMode === "direct" ? (
                <label className="field">
                  <span className="lab">
                    {d.form.perUserRateLabel[metric as "tps" | "rps" | "pageviews"]}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={perUserRate}
                    onChange={(e) => setPerUserRate(e.target.value)}
                  />
                </label>
              ) : (
                <div className="row" style={{ marginTop: 4 }}>
                  <label className="field" style={{ marginTop: 12 }}>
                    <span className="lab">
                      {d.form.actionsPerClick[metric as "tps" | "rps" | "pageviews"]}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={actionsPerClick}
                      onChange={(e) => setActionsPerClick(e.target.value)}
                    />
                  </label>
                  <label className="field" style={{ marginTop: 12 }}>
                    <span className="lab">{d.form.thinkTime}</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={thinkTime}
                      onChange={(e) => setThinkTime(e.target.value)}
                    />
                  </label>
                </div>
              )}
              {perUserMode === "behavior" && (
                <span className="hint">{d.form.thinkTimeHint}</span>
              )}
            </div>
          )}

          <label className="field">
            <span className="lab">{d.form.stayTime}</span>
            <input
              type="number"
              min="0"
              step="any"
              value={stayMinutes}
              onChange={(e) => setStayMinutes(e.target.value)}
            />
            <span className="hint">{d.form.stayTimeHint}</span>
          </label>

          <label className="field">
            <span className="lab">{d.form.utilization}</span>
            <input
              type="number"
              min="0"
              max="100"
              step="any"
              value={utilizationPct}
              onChange={(e) => setUtilizationPct(e.target.value)}
            />
            <span className="hint">{d.form.utilizationHint}</span>
          </label>

          <button className="linkbtn" onClick={resetExample}>
            {d.form.reset}
          </button>
        </section>

        {/* Results */}
        <section className="card">
          <h2>{d.results.heading}</h2>
          {!r.valid ? (
            <p style={{ color: "var(--muted)" }}>{d.results.invalid}</p>
          ) : (
            <>
              <div className="headline">
                <div className="lab">{d.results.recommendedOutflow}</div>
                <div className="num">{fmt(r.recommendedOutflow)}</div>
                <div className="unit">{d.results.recommendedOutflowUnit}</div>
              </div>

              <div className="statgrid">
                <div className="stat">
                  <div className="k">{d.results.concurrentCapacity}</div>
                  <div className="v">{fmt(r.concurrentCapacity)}</div>
                </div>
                <div className="stat">
                  <div className="k">{d.results.targetConcurrency}</div>
                  <div className="v">{fmt(r.targetConcurrency)}</div>
                </div>
                <div className="stat">
                  <div className="k">{d.results.theoreticalOutflow}</div>
                  <div className="v">
                    {fmt(r.theoreticalOutflow)}{" "}
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {d.results.recommendedOutflowUnit}
                    </span>
                  </div>
                </div>
                <div className="stat">
                  <div className="k">{d.results.perSecond}</div>
                  <div className="v">{fmt1(r.outflowPerSecond)}</div>
                </div>
                {isThroughput && r.steadyStateThroughput !== undefined && (
                  <div className="stat" style={{ gridColumn: "1 / -1" }}>
                    <div className="k">
                      {d.results.steadyThroughput} ({throughputUnit})
                    </div>
                    <div className="v">{fmt(r.steadyStateThroughput)}</div>
                  </div>
                )}
              </div>

              <div className="formulaline">
                {d.results.formulaLine}: {fmt(r.targetConcurrency)} ÷ {fmt1(input.stayMinutes)}{" "}
                {d.chart.minuteShort} = {fmt(r.recommendedOutflow)} {d.results.recommendedOutflowUnit}
              </div>
            </>
          )}
        </section>
      </div>

      {/* Chart */}
      {r.valid && (
        <section className="card">
          <h2>{d.chart.heading}</h2>
          <p style={{ marginTop: 0, color: "var(--muted)", fontSize: 14 }}>{d.chart.caption}</p>
          <TimelineChart
            points={points}
            capacity={r.concurrentCapacity}
            target={r.targetConcurrency}
            stayMinutes={input.stayMinutes}
            t={d.chart}
            fmt={fmt}
          />
        </section>
      )}

      {/* Table */}
      {r.valid && (
        <section className="card">
          <h2>{d.table.heading}</h2>
          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>{d.table.minute}</th>
                  <th>{d.table.admitted}</th>
                  <th>{d.table.leaving}</th>
                  <th>{d.table.active}</th>
                  {isThroughput && <th>{throughputUnit}</th>}
                  <th>{d.table.capacityUsed}</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((p) => {
                  const isTransition = p.minute === r.transitionMinute;
                  const filling = p.minute < r.transitionMinute;
                  return (
                    <tr key={p.minute} className={isTransition ? "transition" : ""}>
                      <td>
                        {p.minute}
                        {p.minute === 0 && (
                          <span className="tag fill">{d.table.phaseFill}</span>
                        )}
                        {isTransition && (
                          <span className="tag leave">{d.table.cohortLeaves}</span>
                        )}
                      </td>
                      <td>{fmt(p.admitted)}</td>
                      <td>{p.leaving > 0 ? fmt(p.leaving) : "—"}</td>
                      <td>{fmt(p.active)}</td>
                      {isThroughput && <td>{fmt(p.active * effPerUserRate)}</td>}
                      <td>
                        {fmt1(p.capacityFraction * 100 * (r.targetConcurrency / r.concurrentCapacity))}
                        %
                        {!filling && p.minute > 0 && (
                          <span className="tag steady">{d.table.phaseSteady}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Insight */}
      <section className="card">
        <h2>{d.insight.heading}</h2>
        <p className="insight-body">{d.insight.body}</p>
        <p className="insight-body">
          <strong>{d.insight.dontDump}</strong>
        </p>
      </section>

        <footer className="note">{d.footer.note}</footer>
      </div>
    </>
  );
}
