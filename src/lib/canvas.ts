import { booksPerRow, rowsPerShelf } from "./consts";
import PRNG from "./rng";

const bookColors = ["#f87171", "#34d399", "#60a5fa", "#fbbf24", "#a78bfa", "#f472b6", "#f97316"];
const red = "#ff0713";
const brown = "#732200";

const bookWidth = 30;
const rowHeight = 180;
const shelfThickness = 8;
const shelfWidth = bookWidth * booksPerRow + shelfThickness;
const shelfHeight = rowHeight * rowsPerShelf;

export function drawShelves(ctx: CanvasRenderingContext2D, center: bigint, windowWidth: number, windowHeight: number, offset: number) {
    const scale = Math.min(windowWidth * 0.9 / shelfWidth, windowHeight * 0.9 / shelfHeight);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, windowWidth, windowHeight);

    const visualWidth = shelfWidth * scale;
    const shelfDistance = visualWidth + 60 * scale;
    const centerX = (windowWidth - visualWidth) / 2;

    // Draw shelves to the right
    for(let shelfOffset = Math.floor(offset); centerX + shelfDistance * (shelfOffset - offset) < windowWidth; shelfOffset++) {
        // Center the shelf
        ctx.setTransform(
            scale, 0, 0, scale, 
            centerX + shelfDistance * (shelfOffset - offset),
            (windowHeight - shelfHeight * scale) / 2,
        );
    
        const shelfIndex = center + BigInt(shelfOffset);
        drawShelf(ctx, shelfIndex);
    }

    // Draw shelves to the left
    for(let shelfOffset = Math.floor(offset) - 1; centerX + shelfDistance * (shelfOffset - offset) + visualWidth > 0 && center + BigInt(shelfOffset) >= 1; shelfOffset--) {
        // Center the shelf
        ctx.setTransform(
            scale, 0, 0, scale, 
            centerX + shelfDistance * (shelfOffset - offset),
            (windowHeight - shelfHeight * scale) / 2,
        );
    
        const shelfIndex = center + BigInt(shelfOffset);
        drawShelf(ctx, shelfIndex);
    }
}

interface BookAddress {
    shelf: bigint;
    row: number;
    book: number;
}

export function getBookAtPos(x: number, y: number, center: bigint, windowWidth: number, windowHeight: number, offset: number): BookAddress | null {
    const scale = Math.min(windowWidth * 0.9 / shelfWidth, windowHeight * 0.9 / shelfHeight);

    // Calculate the shelf
    const visualWidth = shelfWidth * scale;
    const shelfDistance = visualWidth + 60 * scale;
    const centerLeft = (windowWidth - visualWidth) / 2 - offset * shelfDistance;
    const shelf = center + BigInt(Math.floor((x - centerLeft) / shelfDistance));
    if(shelf < 1n) return null;

    // Calculate the book
    const bookX = (x - centerLeft) % shelfDistance - (shelfThickness / 2) * scale;
    const book = Math.floor(bookX / (bookWidth * scale));
    if(book < 0 || book >= booksPerRow) return null;

    // Calculate the row
    const visualHeight = shelfHeight * scale;
    const visualRowHeight = rowHeight * scale;
    const top = (windowHeight - visualHeight) / 2 - (shelfThickness / 2) * scale;
    
    // Don't allow clicking above the books/on the shelf
    if((y - top) % visualRowHeight < 20) return null;
    const row = Math.floor((y - top) / visualRowHeight);
    if(row < 0 || row >= rowsPerShelf) return null;

    return { shelf, row, book };
}

const rng = new PRNG();
export function drawShelf(ctx: CanvasRenderingContext2D, shelf: bigint) {
    rng.setSeed(shelf.toString());

    // Draw the books
    for(let i = 0; i < rowsPerShelf; i++) {
        for(let j = 0; j < booksPerRow; j++) {
            const height = rng.randomRange(140, 160);
            const x = shelfThickness / 2 + j * bookWidth;
            const y = -shelfThickness / 2 + i * rowHeight + rowHeight - height;

            drawBook(ctx, x, y, height);
        }
    }

    // Draw the shelf
    ctx.strokeStyle = brown;
    ctx.lineWidth = shelfThickness;
    ctx.lineCap = "square";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(shelfWidth, 0);
    ctx.lineTo(shelfWidth, shelfHeight);
    ctx.lineTo(0, shelfHeight);
    ctx.closePath();
    ctx.stroke();

    for(let i = 1; i < rowsPerShelf; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * rowHeight);
        ctx.lineTo(shelfWidth, i * rowHeight);
        ctx.stroke();
    }

    // ctx.fillStyle = "white";
    // ctx.font = "30px Arial";
    // ctx.fillText(shelf.toString(), 10, 40);
}

function drawBook(ctx: CanvasRenderingContext2D, x: number, y: number, height: number) {
    const color = bookColors[rng.random(bookColors.length)];

    const type = rng.randomRange(1, 7);

    ctx.fillStyle = color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(x, y, bookWidth, height, 6);
    ctx.fill();
    ctx.stroke();

    // Type 1 = blank
    if(type === 2) {
        // Line at the top and bottom
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 20);
        ctx.lineTo(x - 1 + bookWidth, y + 20);
        ctx.moveTo(x + 1, y + height - 20);
        ctx.lineTo(x - 1 + bookWidth, y + height - 20);
        ctx.stroke();
    } else if(type === 3) {
        // Circle with a lines at the top
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 15);
        ctx.lineTo(x - 1 + bookWidth, y + 15);
        ctx.moveTo(x + 1, y + 35);
        ctx.lineTo(x - 1 + bookWidth, y + 35);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(x + bookWidth / 2, y + 25, 10, 0, Math.PI * 2);
        ctx.stroke();
    } else if(type === 4) {
        // Double lines at the top
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 20);
        ctx.lineTo(x - 1 + bookWidth, y + 20);
        ctx.moveTo(x + 1, y + 30);
        ctx.lineTo(x - 1 + bookWidth, y + 30);
        ctx.stroke();
    } else if(type === 5) {
        // Black box at the top
        ctx.fillStyle = "black";
        ctx.fillRect(x + 1, y + 15, bookWidth - 2, 20);
    } else if(type === 6) {
        // Ellipse in the middle
        ctx.beginPath();
        ctx.ellipse(x + bookWidth / 2, y + height / 2, bookWidth / 2 - 6, 25, 0, 0, Math.PI * 2);
        ctx.stroke();
    } else {
        // Ellipse with line on top and bottom
        ctx.beginPath();
        ctx.ellipse(x + bookWidth / 2, y + height / 2, bookWidth / 2 - 6, 25, 0, 0, Math.PI * 2);
        ctx.moveTo(x + 1, y + 20);
        ctx.lineTo(x - 1 + bookWidth, y + 20);
        ctx.moveTo(x + 1, y + height - 20);
        ctx.lineTo(x - 1 + bookWidth, y + height - 20);
        ctx.stroke();
    }
}