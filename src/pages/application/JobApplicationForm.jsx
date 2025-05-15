import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const JobApplicationForm = ({ jobId, formData, formErrors, isLoading, handleInputChange, handleFileChange, handleSubmit, navigate }) => {
    if (!jobId) return null;

    return (
        <div className="h-fit py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900">Job Application</CardTitle>
                        <CardDescription>
                            Please fill out the form below to apply for this position.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
                                    Cover Letter
                                </Label>
                                <Textarea
                                    id="coverLetter"
                                    name="coverLetter"
                                    rows={6}
                                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#1e7eeb] focus:ring-[#1e7eeb] ${formErrors.coverLetter ? 'border-red-500' : ''}`}
                                    placeholder="Explain why you're a good fit for this position..."
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                />
                                {formErrors.coverLetter && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.coverLetter}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                                    Resume (PDF or DOCX, max 5MB)
                                </Label>
                                <Input
                                    id="resume"
                                    name="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className={`mt-1 h-11 block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-md file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-[#1e7eeb] file:text-white
                                    hover:file:bg-[#1565c0] ${formErrors.resume ? 'border-red-500' : ''}`}
                                    onChange={handleFileChange}
                                    required
                                />
                                {formErrors.resume && (
                                    <p className="mt-1 text-sm text-red-600">{formErrors.resume}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Upload your resume in PDF or Word format (max 5MB)
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    style={{ backgroundColor: '#1e7eeb' }}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm hover:bg-[#1565c0] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e7eeb]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default JobApplicationForm;