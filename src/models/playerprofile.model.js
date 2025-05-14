import mongoose, {Schema} from 'mongoose'

const PlayerProfileSchema = new Schema(
{
user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},

  skillLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },

  location: {
    type: String,
    default: '' ,
    trim: true,
  },

  bio: {
    type: String,
    default: '' ,
    trim: true,
  },

  preferences: {
    type: String,
    enum: ['casual', 'competitive'],
    default: 'casual',
  },

  availability: {
    type: String,
    enum: ['weekdays', 'weekends', 'both'],
    default: 'both',
  },
  followedFutsals: [
    { 
    type: Schema.Types.ObjectId, 
    ref: 'Futsal' 
    }
  ],
  reviews: [
    { player: { 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
    },
      comment: String,
      rating: Number,
    }
  ]
}, { timestamps: true });

export const PlayerProfile = mongoose.model('PlayerProfile', PlayerProfileSchema)
