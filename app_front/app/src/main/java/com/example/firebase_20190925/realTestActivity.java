package com.example.firebase_20190925;

import android.os.Bundle;
import android.util.Log;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.firebase_20190925.adapter.TestAdapter;
import com.example.firebase_20190925.adapter.UserAdapter;
import com.example.firebase_20190925.model.Test;
import com.example.firebase_20190925.model.UserModel;
import com.example.firebase_20190925.service.IApiService;
import com.example.firebase_20190925.service.RestClient;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class realTestActivity extends AppCompatActivity {
    private RecyclerView mRecyclerView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_realtest);

        mRecyclerView=findViewById(R.id.recycler_view);
        mRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        IApiService iApiService=new RestClient("http://49.236.136.213:3000/").getApiService();
        Call<ArrayList<Test>> call = iApiService.getTest();
        try {
            call.enqueue(new Callback<ArrayList<Test>>() {
                @Override
                public void onResponse(Call<ArrayList<Test>> call, Response<ArrayList<Test>> response) {
                    if (response.isSuccessful()) {

                        try {
                            TestAdapter ta = new TestAdapter(response.body());
                            //String tmp=response.body()
                            Log.d("받아온 데이터123","성공"+response.body().toString());
                            Log.d("받아오기","성공");
                            // Log.d("받아온 데이터","성공"+response.body().);
                            // Log.d("바디명",""+tmp);
                            mRecyclerView.setAdapter(ta);
                        }
                        catch(Exception e) {
                            Log.d("예외",""+response.body().toString());

                        }
                    }

                }

                @Override
                public void onFailure(Call<ArrayList<Test>> call, Throwable t) {

                }
            });
        }catch(Exception t)
        {
            t.printStackTrace();
        }
    }
}
