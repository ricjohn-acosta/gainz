export const postValidation = (post: string) => {
    if (!post || !/\S/.test(post)) {
        return "Required"
    }
}