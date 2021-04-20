import HttpStatus from 'http-status-codes';
import Cuboid from '../models/Cuboid';
import { byId } from './filters';
import Bag from '../models/Bag';

export const list = async (req, res) => {
  const cuboids = await Cuboid.query()
    .where(byId(req.query))
    .withGraphFetched('bag');
  return res.status(200).json(cuboids);
};

export const get = async (req, res) => {
  const cuboid = await Cuboid.query().findById(req.params.id);
  if (!cuboid) {
    return res.sendStatus(HttpStatus.NOT_FOUND);
  }
  return res.status(200).json(cuboid);
};

export const create = async (req, res) => {
  const { width, height, depth, bagId } = req.body;
  const bag = await Bag.query().findById(bagId).withGraphFetched('cuboids');
  bag.cuboids.forEach((cuboid) => {
    bag.volume = bag.volume - cuboid.volume;
  });
  if (bag.volume >= width * height * depth) {
    const cuboid = await Cuboid.query().insert({
      width,
      height,
      depth,
      bagId,
      volume: width * height * depth,
    });
    return res.status(HttpStatus.CREATED).json(cuboid);
  } else {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: 'Insufficient capacity in bag' });
  }
};

export const del = async (req, res) => {
  const { cuboidId } = req.body;
  const cuboid = await Cuboid.query()
    .where({ id: parseInt(cuboidId) })
    .del();
  return res.status(HttpStatus.OK).json(cuboid);
};
