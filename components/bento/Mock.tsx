import type { ProjectIcon } from "@/data/profile";

const v = (name: string, value: number | string) => ({ [name]: value }) as React.CSSProperties;

// A small fake app screen, shaped after the kind of project
export default function Mock({ kind }: { kind: ProjectIcon }) {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-bar"><i /><i /><i /></div>
      <div className="mock-body">
        {kind === "ticket" &&
          [0, 1, 2].map((n) => <div className="m-row" style={v("--i", n)} key={n}><b /><span /><em /></div>)}
        {kind === "globe" && (
          <>
            <div className="m-hero" />
            <div className="m-cols">{[0, 1, 2].map((n) => <span style={v("--i", n)} key={n} />)}</div>
          </>
        )}
        {kind === "pos" && (
          <>
            <div className="m-tiles">{[0, 1, 2, 3, 4, 5].map((n) => <span style={v("--i", n)} key={n} />)}</div>
            <div className="m-total" />
          </>
        )}
        {(kind === "star" || kind === "report" || kind === "services") && (
          <div className="m-chart">
            {[45, 70, 55, 90, 65, 82, 60].map((h, n) => (
              <span key={n} style={{ ...v("--i", n), ...v("--h", `${h}%`) }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
