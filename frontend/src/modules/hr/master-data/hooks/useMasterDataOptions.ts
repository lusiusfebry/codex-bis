import { useEffect, useState } from "react";

import { fetchMasterData } from "@/api/masterData";

type Option = {
  label: string;
  value: string;
};

export function useMasterDataOptions<T extends { id: string }>(
  resource: string,
  mapOption: (item: T) => Option,
) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOptions = async () => {
      setLoading(true);

      try {
        const response = await fetchMasterData<T>(resource, {
          page: 1,
          limit: 100,
          status: "Aktif",
        });
        setOptions(response.data.map(mapOption));
      } finally {
        setLoading(false);
      }
    };

    void loadOptions();
  }, [resource, mapOption]);

  return {
    options,
    loading,
  };
}
