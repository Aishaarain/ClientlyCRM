
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Invoice from '../models/Invoice.js';
import AIContent from '../models/AIContent.js';

import {
  streamProposal,
  streamFollowUp,
  insightsTwoPass
} from '../services/groqService.js';

import { differenceInDays } from 'date-fns';

/**
 * Generate AI Proposal
 */
export const generateProposal = async (req, res, next) => {
  try {
    const { clientId, projectId } = req.body;

    const [client, project] = await Promise.all([
     Client.findOne({ _id: clientId, createdBy: req.user._id }),
     Project.findOne({ _id: projectId, createdBy: req.user._id })
    ]);

    if (!client || !project) {
      return res.status(404).json({
        message: 'Client or project not found'
      });
    }

    const content = await streamProposal({ client, project }, res);

    await AIContent.create({
      userId: req.user._id,
      clientId,
      projectId,
      type: 'proposal',
      content
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate AI Follow-up
 */
export const generateFollowUp = async (req, res, next) => {
  try {
    const { clientId, invoiceId } = req.body;

    const [client, invoice] = await Promise.all([
     Client.findOne({ _id: clientId, createdBy: req.user._id }),
     Invoice.findOne({ _id: invoiceId, createdBy: req.user._id })
    ]);

    if (!client || !invoice) {
      return res.status(404).json({
        message: 'Client or invoice not found'
      });
    }

    const daysOverdue = differenceInDays(
      new Date(),
      new Date(invoice.dueDate)
    );

    const content = await streamFollowUp(
      {
        client,
        invoice,
        daysOverdue
      },
      res
    );

    await AIContent.create({
      userId: req.user._id,
      clientId,
      invoiceId,
      type: 'follow_up',
      content
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate AI Insights
 */
export const queryInsights = async (req, res, next) => {
  try {
    const { query } = req.body;

    const rawResults = await Client.find({
      userId: req.user._id,
      status: 'at-risk'
    }).limit(20);

    const content = await insightsTwoPass(
      {
        query,
        rawResults
      },
      res
    );

    await AIContent.create({
      userId: req.user._id,
      type: 'insight',
      prompt: query,
      content
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get AI Content
 */
export const getAIContent = async (req, res, next) => {
  try {
    const filter = {
      userId: req.user._id
    };

    if (req.query.clientId) {
      filter.clientId = req.query.clientId;
    }

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const aiContent = await AIContent.find(filter).sort({
      createdAt: -1
    });

    res.json(aiContent);
  } catch (err) {
    next(err);
  }
};

/**
 * Update AI Content
 */
export const updateAIContent = async (req, res, next) => {
  try {
    const updatedContent = await AIContent.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id
      },
      {
        edited: true,
        editedContent: req.body.content
      },
      {
        new: true
      }
    );

    if (!updatedContent) {
      return res.status(404).json({
        message: 'AI content not found'
      });
    }

    res.json(updatedContent);
  } catch (err) {
    next(err);
  }
};

