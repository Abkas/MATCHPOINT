import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'

const FutsalSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    location: {
        type: String,
        required: true 
        },
    description: {
        type: String 
    },
    organizer: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review' 
        }
    ],
    followers: [
        {
        type: Schema.Types.ObjectId,
        ref: 'User' 
        }
    ],
}, { timestamps: true });

FutsalSchema.methods.getFollowers = function () {
    return this.followers;
};

FutsalSchema.methods.addFollower = function (playerId) {
    this.followers.push(playerId);
    return this.save();
};

FutsalSchema.methods.removeFollower = function (playerId) {
    this.followers.pull(playerId);
    return this.save();
};

FutsalSchema.methods.getFollowersCount = function () {
    return this.followers.length;
}

FutsalSchema.methods.getReviews = function () {
    return this.reviews;
}

FutsalSchema.methods.addReview = function (reviewId) {
    this.reviews.push(reviewId);
    return this.save();
};

FutsalSchema.methods.removeReview = function (reviewId) {
    this.reviews.pull(reviewId);
    return this.save();
};

export const Futsal = mongoose.model('Futsal', FutsalSchema);