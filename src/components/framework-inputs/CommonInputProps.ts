import { FrameworkComponent } from "../../data/frameworks";

export interface CommonInputProps {
  component: FrameworkComponent;
  value: any;
  onChange: (name: string, value: any, details: any) => void;
  onBlur: (name: string) => void;
  error?: string;
  isTouched?: boolean;
  showDevMode: boolean;
  onAiAssist?: (
    name: string,
    value: string,
    details: any,
    type: string,
  ) => Promise<void>;
  isAiAssisting?: boolean;
  customValue?: string; // For "Lainnya..." in select inputs
  onCustomChange?: (name: string, value: string, details: any) => void;
}
