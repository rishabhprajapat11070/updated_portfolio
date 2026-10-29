function About() {
  const interests = [
    {
      number: '01',
      title: 'Frontend Development',
      description:
        'Creating clean, responsive interfaces that feel easy to use.',
    },
    {
      number: '02',
      title: 'Backend Development',
      description:
        'Building APIs and connecting applications with databases.',
    },
    {
      number: '03',
      title: 'Continuous Learning',
      description:
        'Exploring new tools and learning by building small projects.',
    },
        {
      number: '04',
      title: 'confident',
      description:
        'feel to free to talk with any one ',
    },
  ];
  console.log(interests[0].number)

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-widest text-violet-400">
          A little about me
        </p>

        <div className="mt-5 grid items-start gap-10 md:grid-cols-2">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Curious mind.
            <br />
            <span className="text-violet-400">Creative approach.</span>
          </h1>

          <div className="space-y-5 leading-8 text-slate-400">
            <p>
              Hello! I’m Rishabh, an aspiring software developer who loves
              understanding how things work and bringing ideas to life.
            </p>

            <p>
              My learning journey includes frontend interfaces, backend
              development, and databases. I enjoy breaking big problems
              into small, manageable steps.
            </p>

            <p>
              Outside coding, you might find me creating videos, exploring
              new ideas, or planning my next project.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {interests.map((interest) => (
            <article
              key={interest.number}
              
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 transition hover:border-violet-500/50"
            >
              <span className="text-sm font-semibold text-violet-400">
                {interest.number}
              </span>

              <h2 className="mt-6 text-xl font-semibold">
                {interest.title}
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-400">
                {interest.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default About;