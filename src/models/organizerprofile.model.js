import mongoose, {Schema} from 'mongoose'

const OrganizerProfileSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
    },

  bio: { 
    type: String, 
    default: ''  
    },

  location: { 
    type: String, 
    default: '' 
    },

  isVerified: { 
    type: Boolean, 
    default: false 
    },

  futsals: [
    { type: Schema.Types.ObjectId, 
    ref: 'Futsal' 
    }
  ],
  
}, { timestamps: true });

export const OrganizerProfile = mongoose.model('OrganizerProfile', OrganizerProfileSchema);
