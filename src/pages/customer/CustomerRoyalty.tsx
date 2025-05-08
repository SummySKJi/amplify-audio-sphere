
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CustomerRoyalty = () => {
  const reports = [
    {
      id: '1',
      period: 'April 2025',
      uploadDate: '2025-05-01',
      formats: ['PDF', 'CSV', 'XLSX'],
    },
    {
      id: '2',
      period: 'March 2025',
      uploadDate: '2025-04-05',
      formats: ['PDF', 'CSV'],
    },
    {
      id: '3',
      period: 'February 2025',
      uploadDate: '2025-03-08',
      formats: ['PDF', 'XLSX'],
    },
    {
      id: '4',
      period: 'January 2025',
      uploadDate: '2025-02-06',
      formats: ['PDF', 'CSV'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Royalty Reports</h2>
        <p className="text-gray-400">View and download your earning reports</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">{report.period}</CardTitle>
                <div className="p-2 bg-gray-700 rounded-md">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">Upload Date:</p>
                  <p className="text-sm">
                    {new Date(report.uploadDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Available Formats:</p>
                  <div className="flex flex-wrap gap-2">
                    {report.formats.map((format) => (
                      <Badge
                        key={format}
                        variant="outline"
                        className="bg-gray-700 hover:bg-primary/20 border-gray-600 cursor-pointer flex items-center gap-1"
                      >
                        <FileDown className="h-3 w-3" />
                        <span>{format}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <button className="w-full text-center text-sm text-primary hover:underline mt-2">
                  View Details
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reports.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-300">No reports available</h3>
          <p className="text-gray-400">Reports will appear here when they are uploaded by the admin</p>
        </div>
      )}
    </div>
  );
};

export default CustomerRoyalty;
