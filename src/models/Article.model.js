import mongoose from "mongoose";
import slugify from "slugify";

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Technologie", "Santé", "Éducation", "Voyage"],
      required: true,
    },
    tags: [
      {
        type: String,
        minlength: 2,
        maxlength: 20,
        validate: {
          validator: function (v) {
            return /^[a-zA-Z0-9\-_]+$/.test(v); // Exemple : seulement alphanumérique
          },
          message:
            "Les tags ne doivent contenir que des lettres, chiffres, - et _",
        },
      },
    ],
    content: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    statut: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        return slugify(this.title, { lower: true, strict: true });
      },
    },
     createdAt: {
    type: Date,
    default: Date.now,
    get: v => v.toISOString() // Formatage automatique
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    get: v => v.toISOString()
  },
  },
);

// Méthode d'instance
ArticleSchema.methods.getFormattedArticle = function (
  format = "Titre: {title}\nDescription: {description}"
) {
  return format
    .replace("{title}", this.title)
    .replace("{description}", this.description);
};

// Méthode statique
ArticleSchema.statics.findByCategory = function (category) {
  return this.find({ category });
};
ArticleSchema.index({
  title: "text",
  description: "text",
  content: "text",
});

ArticleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

ArticleSchema.virtual("summary").get(function () {
  return this.content.substring(0, 100) + "...";
});

export const Article = mongoose.model("Article", ArticleSchema);
