import type {
	DBPaginationOptions,
	DBUpdateOption,
	DBUpdateOptions,
	Pose,
} from '@poser/types';
import { Collection, MongoClient, ObjectID } from 'mongodb';
import * as config from '../../config';
import localAdapter from '../localAdapter';

let db: Promise<{
	[key: string]: Collection;
	training: Collection<Pose>;
}>;

async function addTrainingPose(pose: Pose | Pose[]) {
	const { training } = await db;

	let data = Array.isArray(pose) ? pose : [pose];

	console.log('[DB] Adding ' + data.length + ' new Poses');

	return await training.insertMany(data);
}

async function getAllTrainingPoses(): Promise<Pose[]> {
	return (await db).training.find({}).toArray();
}

async function getTrainingPosesByID(id): Promise<Pose[]> {
	return (await db).training.find({ id }).toArray();
}

async function getAllPoses(): Promise<Pose[]> {
	return (await db).poses.find({}).toArray();
}

async function addPose(pose: Pose) {
	return (await db).poses.insertOne(pose);
}

async function addPoses(poses: Pose[]) {
	return (await db).poses.insertMany(poses);
}

async function deletePose(poseId: string) {
	return (await db).poses.deleteOne({ id: poseId });
}

async function updatePose(poseId: string, update: Partial<Pose>) {
	return (await db).poses.updateOne({ _id: poseId }, { $set: update });
}

async function getTrainingPoses({
	amount = 100,
	offset = 0,
	verified,
	id,
}: DBPaginationOptions): Promise<Pose[]> {
	let filters: { [key: string]: any }[] = [
		{ $skip: offset },
		{ $limit: amount },
	];

	const query: { [key: string]: any } = {};

	if (typeof verified !== 'undefined') {
		query.verified = verified;
	}

	if (typeof id === 'string' && id.length) {
		query.id = id;
	}

	if (Object.keys(query).length) {
		filters = [{ $match: query }, ...filters];
	}

	return (await db).training.aggregate(filters).toArray();
}

async function getVerifiedTrainingPoses(): Promise<Pose[]> {
	return (await db).training.find({ verified: true }).toArray();
}

async function updateSingleTrainingPose(updateOptions: DBUpdateOption) {
	return (await db).training.updateOne(
		//@ts-ignore
		{ _id: new ObjectID(updateOptions.id) },
		{ $set: updateOptions.updates }
	);
}

async function updateTrainingPoses(updates: DBUpdateOptions) {
	return updates.map((up) => updateSingleTrainingPose(up));
}

async function getPoseById(poseId: string) {
	return (await db).poses.findOne({ id: poseId });
}

async function initData() {
	const poses = await getAllPoses();

	if (!poses.length) {
		await addPoses(await localAdapter().getAllPoses());
	}
}

export default () => {
	const client = new MongoClient(config.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	db = new Promise((res, rej) => {
		client.connect((err) => {
			if (err) {
				return rej(err);
			} else {
				console.log('[DB-mongo] connected');
			}

			res({
				training: client.db('training').collection('poses'),
				poses: client.db('poses').collection('main'),
			});
		});
	});

	initData();

	return {
		addTrainingPose,
		getAllTrainingPoses,
		getTrainingPoses,
		getVerifiedTrainingPoses,
		getTrainingPosesByID,
		updateSingleTrainingPose,
		updateTrainingPoses,

		getAllPoses,
		getPoseById,
		addPose,
		deletePose,
		updatePose,
	};
};
