import { Response } from "express";
import Holding, { AssetType } from "../models/holdingModel";
import asyncErrorHandler from "../middlewares/helpers/asyncErrorHandler";
import { AuthenticatedRequest } from "../middlewares/user_actions/auth";

const ASSET_TYPES: AssetType[] = ["gold", "silver", "platinum"];

/**
 * GET /api/holdings  (auth required)
 *
 * Returns the current user's metal holdings shaped for the dashboard /
 * portfolio UI. Missing asset types default to 0 grams instead of being
 * omitted, so the frontend never has to special-case "no holding yet".
 */
export const getUserHoldings = asyncErrorHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const holdings = await Holding.find({ user: req.user._id });

    const byType = new Map(holdings.map((h) => [h.assetType, h]));

    const breakdown = ASSET_TYPES.map((assetType) => {
      const holding = byType.get(assetType);
      return {
        assetType,
        amountGrams: holding?.amount ?? 0,
        updatedAt: holding?.updatedAt ?? null,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        holdings: breakdown,
        // Convenience flat shape for existing UI (see UserHolding in
        // web/lib/store.ts) so components can adopt this without a
        // large refactor.
        goldGrams: byType.get("gold")?.amount ?? 0,
        silverGrams: byType.get("silver")?.amount ?? 0,
        platinumGrams: byType.get("platinum")?.amount ?? 0,
      },
    });
  }
);
