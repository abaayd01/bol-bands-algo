/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  runPy.then(data => {
    res.send({
      data
    })
  }).catch(err => {
    res.send({
      err
    })
  })
}
