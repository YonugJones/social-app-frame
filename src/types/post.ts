export type PostCardAuthor = {
  id: string
  image: string | null
  username: string | null
  displayName: string | null
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
