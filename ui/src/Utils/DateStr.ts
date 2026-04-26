export default function date(date: string): string {
    const [year, month, day] = date.split("T")[0].split("-");
    const months = [
        "січня", "лютого", "березня", "квітня", "травня", "червня",
        "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ];

    return `${day} ${months[+month - 1]} ${year}`;
}
