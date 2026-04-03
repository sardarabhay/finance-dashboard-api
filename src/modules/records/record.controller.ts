import { Request, Response, NextFunction } from 'express';
import * as recordService from './record.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { recordFilterSchema } from './record.schema';

export const createRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.createRecord({
      ...req.body,
      createdById: req.user!.id,
    });
    res.status(201).json(ApiResponse.ok(record, 'Record created'));
  } catch (err) {
    next(err);
  }
};

export const getRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = recordFilterSchema.parse(req.query);
    const result = await recordService.getRecords(filters);
    res.json(ApiResponse.ok(result));
  } catch (err) {
    next(err);
  }
};

export const getRecordById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    res.json(ApiResponse.ok(record));
  } catch (err) {
    next(err);
  }
};

export const updateRecord = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    res.json(ApiResponse.ok(record, 'Record updated'));
  } catch (err) {
    next(err);
  }
};

export const deleteRecord = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    await recordService.deleteRecord(req.params.id);
    res.json(ApiResponse.ok(null, 'Record deleted'));
  } catch (err) {
    next(err);
  }
};