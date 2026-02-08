export type PostCardAuthor = {
  username: string
  displayName: string | null
  imageUrl: string | null
}

export type PostCardCounts = {
  likes: number
  comments: number
}

export type PostCardData = {
  id: string
  content: string
  createdAt: Date
  author: PostCardAuthor
  _count: PostCardCounts
}
