export function generateRandomColor () {
    const col = Math.floor(Math.random() * 0xffffff).toString(16);

    return "#" + col;
}