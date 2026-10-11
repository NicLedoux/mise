import mongoose, { Schema } from 'mongoose'
const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    description: String,
    ingredients: { type: [String], required: true },
    steps: { type: [String], required: true },
    prepTime: Number,
    cookTime: Number,
    servings: Number,
    contents: String,
    tags: [String],
  },
  { timestamps: true },
)
export const Recipe = mongoose.model('recipe', recipeSchema)
