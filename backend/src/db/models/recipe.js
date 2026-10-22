import mongoose, { Schema } from 'mongoose'
const recipeSchema = new Schema(
  {
    title: { type: String, required: true },
    imageURL: String,
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    description: String,
    ingredients: {
      type: [String],
      validate: {
        validator: (v) => v.length > 0,
        message: '`ingredients` are required',
      },
    },
    steps: {
      type: [String],
      validate: {
        validator: (v) => v.length > 0,
        message: '`steps` are required',
      },
    },
    prepTime: Number,
    cookTime: Number,
    servings: Number,
    tags: [String],
  },
  { timestamps: true },
)
export const Recipe = mongoose.model('recipe', recipeSchema)
