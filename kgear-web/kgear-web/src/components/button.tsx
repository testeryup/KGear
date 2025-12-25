import { type Color } from "../lib/types";

let url: string = "https://google.com";
// type Color = "red" | "blue" | "green"
type ButtonProps = React.ComponentProps<"button">;
// unknow type
// zod
export default function Button({

    onClick
}: ButtonProps) {
    return (
        <button style={{

        }} onClick={onClick} type="submit" autoFocus={true}>
            {}
        </button>
    )
}