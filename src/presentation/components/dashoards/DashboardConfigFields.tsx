import React from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import {
  Cog6ToothIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

import SelectField from "@/presentation/components/shared/SelectField";
import InputField from "@/presentation/components/shared/forms/InputField";
import Button from "@/presentation/components/shared/forms/Button";

import {
  INTERVAL_UNITS,
} from "@utils/timeUtils";
import { useDashboardConfigStore } from "@/core/store/useDashboardConfigStore";
import { useDashboardUIStore } from "@/core/store/useDashboardUIStore";

type Props = {
  onSave: () => void;
  onForceRefresh?: () => void;
};

export default function DashboardConfigFields({
  onSave,
  onForceRefresh,
}: Props) {
  const autoRefreshIntervalValue = useDashboardConfigStore((s) => s.autoRefreshIntervalValue);
  const autoRefreshIntervalUnit = useDashboardConfigStore((s) => s.autoRefreshIntervalUnit);
  const timeRangeFrom = useDashboardConfigStore((s) => s.timeRangeFrom);
  const timeRangeTo = useDashboardConfigStore((s) => s.timeRangeTo);
  const relativeValue = useDashboardConfigStore((s) => s.relativeValue);
  const relativeUnit = useDashboardConfigStore((s) => s.relativeUnit);
  const timeRangeMode = useDashboardConfigStore((s) => s.timeRangeMode);
  const pageSize = useDashboardConfigStore((s) => s.pageSize);

  const setAutoRefresh = useDashboardConfigStore((s) => s.setAutoRefresh);
  const setTimeRangeAbsolute = useDashboardConfigStore((s) => s.setTimeRangeAbsolute);
  const setTimeRangeRelative = useDashboardConfigStore((s) => s.setTimeRangeRelative);
  const setTimeRangeMode = useDashboardConfigStore((s) => s.setTimeRangeMode);
  const setPageSize = useDashboardConfigStore((s) => s.setPageSize);

  const saving = useDashboardUIStore((s) => s.saving);

  const ConfigPanel = (
    <div className="flex flex-col gap-4 w-80 max-w-[90vw]">
      <TabGroup
        selectedIndex={timeRangeMode === "absolute" ? 0 : 1}
        onChange={(i) =>
          setTimeRangeMode(i === 0 ? "absolute" : "relative")
        }
      >
        <div className="mb-3">
          <span className="font-medium text-sm mb-2 block">Plage temporelle</span>
          <TabList className="flex gap-2">
            {["Absolue", "Relative"].map((label) => (
              <Tab
                key={label}
                className={({ selected }) =>
                  `${selected
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  } px-3 py-1 rounded text-sm`
                }
              >
                {label}
              </Tab>
            ))}
          </TabList>
        </div>

        <TabPanels>
          <TabPanel>
            <div className="flex flex-col gap-2">
              <InputField
                id="timeRangeFrom"
                type="datetime-local"
                label="De"
                className="h-8"
                value={timeRangeFrom || ""}
                onChange={(e) =>
                  setTimeRangeAbsolute(e.target.value, timeRangeTo)
                }
              />
              <InputField
                id="timeRangeTo"
                type="datetime-local"
                label="À"
                className="h-8"
                value={timeRangeTo || ""}
                onChange={(e) =>
                  setTimeRangeAbsolute(timeRangeFrom, e.target.value)
                }
              />
            </div>
          </TabPanel>

          <TabPanel>
            <div className="flex gap-2">
              <InputField
                id="relativeValue"
                type="number"
                min={1}
                label="Derniers"
                className="flex-1 h-8"
                value={relativeValue ?? ""}
                onChange={(e) =>
                  setTimeRangeRelative(
                    e.target.value === "" ? undefined : +e.target.value,
                    relativeUnit
                  )
                }
              />
              <SelectField
                id="relativeUnit"
                label="Unité"
                options={INTERVAL_UNITS}
                value={relativeUnit}
                onChange={(e) =>
                  setTimeRangeRelative(
                    relativeValue,
                    e.target.value as any
                  )
                }
                className="flex-1 h-8"
              />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="mb-3">
          <span className="font-medium text-sm mb-2 block">Auto-actualisation</span>
          <div className="flex gap-2">
            <InputField
              id="autoRefreshIntervalValue"
              type="number"
              min={1}
              label="Toutes les"
              className="flex-1 h-8"
              value={autoRefreshIntervalValue ?? ""}
              onChange={(e) =>
                setAutoRefresh(
                  e.target.value === "" ? undefined : +e.target.value,
                  autoRefreshIntervalUnit
                )
              }
            />
            <SelectField
              id="autoRefreshIntervalUnit"
              label="Unité"
              options={INTERVAL_UNITS}
              value={autoRefreshIntervalUnit}
              onChange={(e) =>
                setAutoRefresh(
                  autoRefreshIntervalValue,
                  e.target.value as any
                )
              }
              className="flex-1 h-8"
              disabled={autoRefreshIntervalValue == null}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <span className="font-medium text-sm mb-2 block">Limite de lignes par source</span>
        <InputField
          id="pageSize"
          type="number"
          min={100}
          max={10000}
          value={pageSize}
          onChange={(e) => {
            const val = +e.target.value;
            if (val >= 100 && val <= 10000) setPageSize(val);
          }}
          className="w-full h-8"
        />
      </div>

      <Button
        type="button"
        color="indigo"
        size="sm"
        className="w-full"
        onClick={onSave}
        disabled={saving}
      >
        Appliquer la configuration
      </Button>
    </div>
  );

  // Popover wrapper
  const renderPopover = (
    icon: React.ReactNode,
    label: string,
    panel: React.ReactNode,
    className?: string
  ) => (
    <Popover className="relative inline-block text-left" key={label}>
      <PopoverButton
        as={Button}
        color="gray"
        variant="outline"
        size="sm"
        className={`flex items-center gap-2 border-gray-200! dark:border-gray-700! ${className}`}
      >
        {icon}
        {label}
      </PopoverButton>
      <PopoverPanel className="absolute top-full right-0 z-50 mt-2 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-xl border border-gray-200 dark:border-gray-700">
        {panel}
      </PopoverPanel>
    </Popover>
  );

  return (
    <div className="flex items-center gap-2 mb-2">
      {renderPopover(
        <Cog6ToothIcon className="w-5 h-5" />,
        "Configuration",
        ConfigPanel
      )}

      {onForceRefresh && (
        <Button
          type="button"
          variant="outline"
          color="gray"
          size="sm"
          className="flex items-center gap-2"
          onClick={onForceRefresh}
          title="Rafraîchir toutes les sources de données"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Rafraîchir les données
        </Button>
      )}
    </div>
  );
}