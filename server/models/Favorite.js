const { Schema, model, Types } = require("mongoose");

const FavoriteSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true, index: true },
    recipeId: { type: String, required: true }, // TheMealDB idMeal
    title: { type: String, required: true },
    thumb: { type: String, required: true },
    category: String,
    area: String
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

module.exports = model("Favorite", FavoriteSchema);
