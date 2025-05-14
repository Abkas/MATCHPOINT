import mongoose, {Schema} from 'mongoose' 
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const GameSchema = new Schema({
    futsal: { 
        type: Schema.Types.ObjectId,
        ref: 'Futsal', 
        required: true 
    },
    slot: { 
        type: Schema.Types.ObjectId, 
        ref: 'Slot', 
        required: true 
    },
    players: [
        {
        type: Schema.Types.ObjectId, 
        ref: 'PlayerProfile' 
        }
    ],
    result: {
        type: String 
    },
    feedbacks: [
        {
        player: { 
            type: Schema.Types.ObjectId, 
            ref: 'Player' 
        },
        comment: String,
        rating: Number,
        }
    ],
}, { timestamps: true });

GameSchema.plugin(mongooseAggregatePaginate);    

export const Game = mongoose.model('Game', GameSchema);
