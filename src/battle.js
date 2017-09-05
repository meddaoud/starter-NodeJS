const battle = (repo1, repo2) => {
  return Promise.resolve(
    { type: 'text', content: `${repo1} VS ${repo2}` }
  )
}

module.exports = battle
