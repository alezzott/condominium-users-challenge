import { Op } from 'sequelize';

type FilterValue = string | number | undefined;
type Filters = Record<string, { [key: symbol]: FilterValue }>;

export function buildFilters(query: Record<string, string | undefined>): { where?: Filters } {
  const filters: Filters = {};

  addFilter(filters, 'nome_sacado', query.nome, value => ({
    [Op.like]: `%${value}%`,
  }));

  addFilter(filters, 'valor', query.valor_inicial, value => ({
    [Op.gte]: Number(value),
  }));

  addFilter(filters, 'valor', query.valor_final, value => ({
    [Op.lte]: Number(value),
  }));

  addFilter(filters, 'id_lote', query.id_lote, value => ({
    [Op.eq]: Number(value),
  }));

  return { where: filters };
}

function addFilter(
  filters: Filters,
  key: string,
  value: string | undefined,
  transform: (value: string) => { [key: symbol]: FilterValue }
): void {
  if (!value) return;

  filters[key] = filters[key] ? { ...filters[key], ...transform(value) } : transform(value);
}
