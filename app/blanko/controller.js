module.exports = {
  index: async (req, res) => {
    try {
      res.render('index', {
          title: "List Blanko"
      });
    } catch (err) {}
  },
};
