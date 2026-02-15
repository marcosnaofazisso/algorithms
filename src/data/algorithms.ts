import { Algorithm } from '@/types/algorithms';

export const algorithms: Algorithm[] = [
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'search',
    description: 'Algoritmo de busca que percorre sequencialmente cada elemento de uma lista até encontrar o elemento desejado ou chegar ao final da lista. É o método mais simples de busca, ideal para listas pequenas ou não ordenadas.',
    bestCase: 'O(1)',
    averageCase: 'O(n)',
    worstCase: 'O(n)',
    spaceComplexity: 'O(1)',
    pythonCode: `def linear_search(arr, target):
    """
    Busca linear em um array.
    
    Args:
        arr: Lista de elementos
        target: Elemento a ser buscado
        
    Returns:
        Índice do elemento se encontrado, -1 caso contrário
    """
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Exemplo de uso
arr = [4, 2, 7, 1, 9, 3, 6, 5]
target = 7
result = linear_search(arr, target)

if result != -1:
    print(f"Elemento encontrado no índice {result}")
else:
    print("Elemento não encontrado")`
  }
];

export const algorithmsByCategory = {
  search: algorithms.filter(algo => algo.category === 'search'),
  sorting: algorithms.filter(algo => algo.category === 'sorting'),
};
