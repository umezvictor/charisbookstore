// this is n array containing price ranges
// this is used in Shop component via RadioBox component
// this prices will be passed to Radiobox as props

export const prices = [
    {
        _id: 0,
        name: "Any",
        array: []
    },
    {
        _id: 1,
        name: "N0 to N9",
        array: [0, 9]
    },
    {
        _id: 2,
        name: "N10 to N19",
        array: [10, 19]
    },
    {
        _id: 3,
        name: "N20 to N29",
        array: [20, 29]
    },
    {
        _id: 4,
        name: "N30 to N39",
        array: [30, 39]
    },
    {
        _id: 5,
        name: "More than 40",
        array: [40, 99] // could be any number above 40
    }
];