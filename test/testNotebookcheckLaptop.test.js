const lap = require("../services/notebookcheckLaptop")


describe("testing NotebookcheckLaptop", () => {
  let notebook = new lap.NotebookcheckLaptop();
  let testParams = {
    manufacturer: "",
    lang: "2",
    model: "",
    gpu: "10478",
    // rating: "70"
  }

  beforeEach(() => {
  })

  test("getLaptops should not throw", async () => {
    expect.assertions(0)
    try {
      await notebook.getLaptops(testParams)
    }
    catch (e) {
      expect(1).toBe(1)
    }
  })

  test("getLaptops elements should have a value", async () => {
    let laps = await notebook.getLaptops(testParams)
    expect.assertions(10 * laps.length)

    for (let each of laps) {
      for (let k in each) {
        if (["wieght", "rating"].includes(k)) {
          expect(each[k]).not.toBe(0)
        }
        else {
          expect(each[k]).not.toBe("")
        }
      }
    }
  })
})