import { Schema, model, Document } from "mongoose";

export type IPlanetCSV = {
  kepid: unknown;
  kepoi_name: unknown;
  kepler_name: string;
  koi_disposition: unknown;
  koi_pdisposition: unknown;
  koi_score: unknown;
  koi_fpflag_nt: unknown;
  koi_fpflag_ss: unknown;
  koi_fpflag_co: unknown;
  koi_fpflag_ec: unknown;
  koi_period: unknown;
  koi_period_err1: unknown;
  koi_period_err2: unknown;
  koi_time0bk: unknown;
  koi_time0bk_err1: unknown;
  koi_time0bk_err2: unknown;
  koi_impact: unknown;
  koi_impact_err1: unknown;
  koi_impact_err2: unknown;
  koi_duration: unknown;
  koi_duration_err1: unknown;
  koi_duration_err2: unknown;
  koi_depth: unknown;
  koi_depth_err1: unknown;
  koi_depth_err2: unknown;
  koi_prad: number;
  koi_prad_err1: unknown;
  koi_prad_err2: unknown;
  koi_teq: unknown;
  koi_teq_err1: unknown;
  koi_teq_err2: unknown;
  koi_insol: number;
  koi_insol_err1: unknown;
  koi_insol_err2: unknown;
  koi_model_snr: unknown;
  koi_tce_plnt_num: unknown;
  koi_tce_delivname: unknown;
  koi_steff: unknown;
  koi_steff_err1: unknown;
  koi_steff_err2: unknown;
  koi_slogg: unknown;
  koi_slogg_err1: unknown;
  koi_slogg_err2: unknown;
  koi_srad: unknown;
  koi_srad_err1: unknown;
  koi_srad_err2: unknown;
  ra: unknown;
  dec: unknown;
  koi_kepmag: unknown;
};

export type IPlanet = {
  keplerName: string;
};

const planetsSchema = new Schema({
  keplerName: {
    type: String,
    required: true,
  },
});

export default model<IPlanet & Document>("Planet", planetsSchema);
