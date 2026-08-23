import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Set the goal. Get the plan. Show up daily.</h1>
        <p className="lede">
          Turn any goal — an exam, a skill, a habit — into a dated plan and a
          daily practice loop. No blank page, no guessing what to do first.
        </p>
        <div className="actions">
          <Link href="/goals/new" className="btn btn-primary">
            Set a goal
          </Link>
          <Link href="/goals" className="btn btn-secondary">
            View my goals
          </Link>
        </div>
      </section>
    </>
  );
}
