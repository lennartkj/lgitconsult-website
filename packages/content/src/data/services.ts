import { getAllContent, RawContentItem } from '../content';
import { Service, PricingTier, ProcessStep } from './types';

// Helper-Funktion zum sicheren Konvertieren von RawContentItem in einen Service-Typ.
// Helper-Funktion zum sicheren Konvertieren von RawContentItem in einen Service-Typ.
const mapToService = (item: RawContentItem): Service => {
  return item as unknown as Service;
};

// Helper-Funktion zum sicheren Konvertieren von RawContentItem in einen PricingTier-Typ.
const mapToPricingTier = (item: RawContentItem): PricingTier => {
  return item as unknown as PricingTier;
};

// Helper-Funktion zum sicheren Konvertieren von RawContentItem in einen ProcessStep-Typ.
const mapToProcessStep = (item: RawContentItem): ProcessStep => {
  return item as unknown as ProcessStep;
};

// --- Datenabfragefunktionen ---

export const getAllServices = async (): Promise<Service[]> => {
  const allContent = await getAllContent('services');
  const allServices = allContent
      .map(mapToService)
      .sort((a, b) => a.id - b.id);
  return allServices;
};

export const getAllPricingTiers = async (): Promise<PricingTier[]> => {
  const allContent = await getAllContent('pricing');
  const allPricingTiers = allContent
      .map(mapToPricingTier)
      .sort((a, b) => a.id - b.id);
  return allPricingTiers;
};

export const getAllProcessSteps = async (): Promise<ProcessStep[]> => {
  const allContent = await getAllContent('process');
  const allProcessSteps = allContent
      .map(mapToProcessStep)
      .sort((a, b) => a.step - b.step);
  return allProcessSteps;
};

// --- Datenzugriffsfunktionen ---

export const getServiceById = async (id: number): Promise<Service | undefined> => {
  const allServices = await getAllServices();
  return allServices.find(service => service.id === id);
};

export const getPricingTierById = async (id: number): Promise<PricingTier | undefined> => {
  const allPricingTiers = await getAllPricingTiers();
  return allPricingTiers.find(tier => tier.id === id);
};

export const getPopularPricingTiers = async (): Promise<PricingTier[]> => {
  const allPricingTiers = await getAllPricingTiers();
  return allPricingTiers.filter(tier => tier.popular);
};

export const getServiceTitles = async (): Promise<{ id: number, title: string, icon: string }[]> => {
  const allServices = await getAllServices();
  return allServices.map(service => ({
    id: service.id,
    title: service.title,
    icon: service.icon
  }));
};

export const getServicesByPillar = async (pillar: "digital" | "creative"): Promise<Service[]> => {
  const allServices = await getAllServices();
  return allServices.filter(service => service.pillar === pillar);
};