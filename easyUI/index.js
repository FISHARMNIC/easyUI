const UI = require('./easy.js');


UI.canvas(() => {
    UI.newUIElement.text({
        data: "Welcome!"
    })

    UI.newUIElement.button({
        element: UI.newUIElement.text({
            id: "sometext",
            isView: true,
            data: `i have been clicked 0 times!`
        }),
        action: (() => {
            //console.log(foo.value)
            foo.value += 1
        })
    })
    
    UI.newUIElement.textInput({
        position: {x: "300px", y: "0"},
        placeholder: "change me!",
        id: "someinput",
        onChange: (() => {
            bar.value = UI.getByID({
                id: "someinput",
                selector: "value"
            })
        })
    })

    UI.newUIElement.text({
        position: {x: "300px", y: "30px"},
        id: "moretext",
        data: ""
    })

    UI.newUIElement.image({
        size: {x: "20%", y: "20%"},
        position: {x: "300px", y: "90px"},
        source: "exampleAssets/cow.png",
    })
})

UI.code(() => {
    var foo = new UI.funcBindObj(() => {
        // when foo is changed, this is all ran
        UI.setByID({
            id: "sometext",
            value: `i have been clicked ${foo.value} times!`
        })
    })

    foo.value = 0

    var bar = new UI.funcBindObj(() => {
        UI.setByID({
            id: "moretext",
            value: bar.value
        })
    })
})

UI.compile()

