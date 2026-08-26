// import { useTranslatedText } from "../hooks/useTranslatedText";

// function TranslatedText({
//     text,
//     className = "",
// }) {

//     const translated =
//         useTranslatedText(text);

//     return (
//         <span className={className}>
//             {translated}
//         </span>
//     );
// }

// export default TranslatedText;


import { useTranslatedText } from "../hooks/useTranslatedText";

function TranslatedText({
    text,
    className = "",
    as: Tag = "span",
}) {

    const translated =
        useTranslatedText(text);

    return (
        <Tag className={className}>
            {translated}
        </Tag>
    );
}

export default TranslatedText;