<script setup>
const route = useRoute()
const { getPostBySlug, getRelatedPosts, categoryLabels } = useBlogPosts()

const post = getPostBySlug(route.params.slug)

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'مطلب مورد نظر پیدا نشد' })
}

const relatedPosts = getRelatedPosts(post.slug)

useHead({
  title: `${post.title} | دنیاوب`,
  meta: [
    { name: 'description', content: post.excerpt }
  ]
})
</script>

<template>
  <div>
    <BlogPostHeader :post="post" :category-label="categoryLabels[post.category]" />
    <BlogPostContent :content="post.content" />
    <BlogAuthor :author="post.author" />
    <BlogRelated :posts="relatedPosts" :category-labels="categoryLabels" />
    <BlogNewsletter />
  </div>
</template>
