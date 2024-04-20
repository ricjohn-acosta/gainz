export const commentValidation = (content) => {
    if (!content || !/\S/.test(content)) {
        return ""
    }
}