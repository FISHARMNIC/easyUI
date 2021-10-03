const UI = require('./easy.js');

UI.canvas(() => {
    UI.newUIElement.text({
        id: "hello"
    })
})

UI.compile()