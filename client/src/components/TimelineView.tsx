// Timeline record type definition
type TimelineRecord = {
  id: number;
  assetId: number;
  companyId: number;
  title: string;
  description: string | null;
  category: "problem" | "maintenance" | "decision" | "inspection";
  authorId: number;
  transcription: string | null;
  recordedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, Wrench, CheckCircle, Clipboard } from "lucide-react";

interface TimelineViewProps {
  records: TimelineRecord[];
}

const categoryConfig = {
  problem: {
    icon: AlertCircle,
    label: "Problema",
    color: "bg-red-50 border-red-200",
    textColor: "text-red-900",
    badgeColor: "bg-red-100 text-red-800",
  },
  maintenance: {
    icon: Wrench,
    label: "Manutenção",
    color: "bg-blue-50 border-blue-200",
    textColor: "text-blue-900",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  decision: {
    icon: CheckCircle,
    label: "Decisão",
    color: "bg-green-50 border-green-200",
    textColor: "text-green-900",
    badgeColor: "bg-green-100 text-green-800",
  },
  inspection: {
    icon: Clipboard,
    label: "Inspeção",
    color: "bg-purple-50 border-purple-200",
    textColor: "text-purple-900",
    badgeColor: "bg-purple-100 text-purple-800",
  },
};

export default function TimelineView({ records }: TimelineViewProps) {
  return (
    <div className="space-y-4">
      {records.map((record, index) => {
        const config = categoryConfig[record.category as keyof typeof categoryConfig];
        const Icon = config.icon;

        return (
          <div key={record.id} className="relative">
            {/* Timeline connector */}
            {index < records.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-8 bg-slate-200" />
            )}

            {/* Record card */}
            <div className={`border rounded-lg p-4 ${config.color}`}>
              <div className="flex gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 pt-1">
                  <Icon className={`w-5 h-5 ${config.textColor}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${config.textColor}`}>
                        {record.title}
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        {format(new Date(record.recordedAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded whitespace-nowrap ${config.badgeColor}`}>
                      {config.label}
                    </span>
                  </div>

                  {record.description && (
                    <p className="text-sm text-slate-700 mt-2">{record.description}</p>
                  )}

                  {record.transcription && (
                    <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-sm text-slate-700">
                      <p className="font-medium text-slate-600 text-xs mb-1">Transcrição de áudio:</p>
                      <p>{record.transcription}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
